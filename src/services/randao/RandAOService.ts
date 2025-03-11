import { ProviderProfileClient, RandomClient } from "src/clients";
import { IRandAOService } from "src/services/randao/abstract";
import { from, lastValueFrom } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { ProviderInfoAggregate } from "./abstract/types";
import { ProviderInfoDataAggregator } from "./ProviderInfoDataAggregator";

/**
 * Service for handling RandAO operations
 * @category RandAO
 */
export class RandAOService implements IRandAOService {
    constructor(
        private readonly randomClient: RandomClient,
        private readonly providerProfileClient: ProviderProfileClient,
    ) { }

    public static async autoConfiguration(): Promise<RandAOService> {
        return new RandAOService(
            await RandomClient.autoConfiguration(),
            ProviderProfileClient.autoConfiguration()
        );
    }

    async getAllProviderInfo(): Promise<ProviderInfoAggregate[]> {
        // Initialize aggregator
        const aggregator = await ProviderInfoDataAggregator.autoconfiguration()

        // Create and process streams
        const activityStream = from(this.randomClient.getAllProviderActivity()).pipe(
            mergeMap(activities => from(activities)),
            mergeMap(async item => {
                await aggregator.updateProviderData(item);
            })
        );

        const infoStream = from(this.providerProfileClient.getAllProvidersInfo()).pipe(
            mergeMap(providers => from(providers)),
            mergeMap(async item => {
                await aggregator.updateProviderData(item);
            })
        );

        // Wait for completion
        await Promise.all([
            lastValueFrom(activityStream),
            lastValueFrom(infoStream)
        ]);

        return aggregator.getAggregatedData();
    }
}
