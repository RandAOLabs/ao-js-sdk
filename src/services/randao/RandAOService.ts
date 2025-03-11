import { ProviderProfileClient, ProviderStakingClient, RandomClient } from "src/clients";
import { MessagesService } from "src/services/messages";
import { IRandAOService } from "src/services/randao/abstract";
import { Observable, from, merge, lastValueFrom } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { ProviderInfo } from "src/clients/randao/provider-profile/abstract/types";
import { ProviderActivity } from "src/clients/randao/random/abstract/types";
import { ProviderInfoAggregate } from "./abstract/types";

/**
 * Service for handling RandAO operations
 * @category RandAO
 */
export class RandAOService implements IRandAOService {
    constructor(
        private readonly randomClient: RandomClient,
        private readonly providerStakingClient: ProviderStakingClient,
        private readonly providerProfileClient: ProviderProfileClient,
        private readonly messagesService: MessagesService
    ) { }

    public static async autoConfiguration(): Promise<RandAOService> {
        return new RandAOService(
            await RandomClient.autoConfiguration(),
            ProviderStakingClient.autoConfiguration(),
            ProviderProfileClient.autoConfiguration(),
            new MessagesService()
        );
    }

    /**
     * Get observable stream of provider info from profile client
     */
    private getProviderInfoStream(): Observable<ProviderInfo> {
        return from(this.providerProfileClient.getAllProvidersInfo()).pipe(
            mergeMap(providerInfo => from(providerInfo)) // Emits each ProviderInfo separately
        );
    }

    /**
     * Get observable stream of provider activity from random client
     */
    private getProviderActivityStream(): Observable<ProviderActivity> {
        return from(this.randomClient.getAllProviderActivity()).pipe(
            mergeMap(providerActivity => from(providerActivity)) // Emits each ProviderInfo separately
        );
    }

    /**
     * Get message count for a specific provider
     * @param providerId The provider ID to get message count for
     * @returns Promise resolving to the message count
     */
    private async getProviderTotalFullfilledCount(providerId: string): Promise<number> {
        return this.messagesService.countAllMessages({
            owner: providerId,
            recipient: this.randomClient.getProcessId(),
            tags: [{ name: "Action", value: "Post-VDF-Output-And-Proof" }]
        });
    }

    /**
     * Initialize a new provider entry in the aggregate map
     * @param providerId The provider ID to initialize
     * @param aggregateMap The map to store the entry in
     * @returns The initialized provider entry
     */
    private initializeProviderEntry(
        providerId: string,
        aggregateMap: Map<string, ProviderInfoAggregate>
    ): ProviderInfoAggregate {
        const entry = { providerId };
        aggregateMap.set(providerId, entry);
        return entry;
    }

    /**
     * Update the message count for a provider entry
     * @param providerId The provider ID to update
     * @param aggregateMap The map containing the entry
     */
    private async updateProviderMessageCount(
        providerId: string,
        aggregateMap: Map<string, ProviderInfoAggregate>
    ): Promise<void> {
        const totalFullfullilled = await this.getProviderTotalFullfilledCount(providerId);

        // Get latest state from map in case of concurrent updates
        const entry = aggregateMap.get(providerId)!;
        entry.totalFullfullilled = totalFullfullilled;
        aggregateMap.set(providerId, entry);
    }

    /**
     * Update provider data based on the item type
     * @param item The provider data item
     * @param aggregateValue The aggregate value to update
     */
    private updateProviderData(
        item: ProviderInfo | ProviderActivity,
        aggregateValue: ProviderInfoAggregate
    ): void {
        if ('staked' in item) {
            aggregateValue.providerActivity = item;
        } else {
            aggregateValue.providerInfo = item;
        }
    }

    async getAllProviderInfo(): Promise<ProviderInfoAggregate[]> {
        // Create a map to store the combined data
        const aggregateMap = new Map<string, ProviderInfoAggregate>();

        // Create streams
        const providerActivityStream = this.getProviderActivityStream();
        const providerInfoStream = this.getProviderInfoStream();

        // Combine streams and process data
        return await lastValueFrom(
            merge(
                providerActivityStream,
                providerInfoStream
            ).pipe(
                mergeMap(async (item) => {
                    const providerId = item.provider_id;
                    let aggregateValue = aggregateMap.get(providerId);

                    if (!aggregateValue) {
                        // Initialize entry and update message count
                        aggregateValue = this.initializeProviderEntry(providerId, aggregateMap);
                        await this.updateProviderMessageCount(providerId, aggregateMap);
                        aggregateValue = aggregateMap.get(providerId)!;
                    }

                    // Update provider data and store in map
                    this.updateProviderData(item, aggregateValue);
                    aggregateMap.set(providerId, aggregateValue);

                    return aggregateValue;
                }),
                map(() => Array.from(aggregateMap.values())) // Convert map to array for final result
            )
        );
    }
}
