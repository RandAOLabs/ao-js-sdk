import { ProviderInfo } from "../../clients/randao/provider-profile/abstract/types";
import { ProviderActivity } from "../../clients/randao/random/abstract/types";
import { ProviderInfoAggregate } from "./abstract/types";
import { MessagesService } from "../messages";
import { ARIOService } from "../ario";
import { DOMAIN } from "../ario/domains";
import RANDOM_PROCESS_TAGS from "../../clients/randao/random/tags";
import { IAutoconfiguration, staticImplements } from "../../utils";
import { RandAODataService } from "./RandAODataService";
import { IRandAODataService } from "./abstract/IRandAODataService";

/**
 * Class responsible for aggregating provider data from multiple sources
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class ProviderInfoDataAggregator {
	private aggregateMap: Map<string, ProviderInfoAggregate>;
	private processedProviderIds: Set<string>;

	private constructor(
		private readonly randaoDataService: IRandAODataService,
	) {
		this.aggregateMap = new Map<string, ProviderInfoAggregate>();
		this.processedProviderIds = new Set<string>();
	}
	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static async autoConfiguration(): Promise<ProviderInfoDataAggregator> {
		const ario = ARIOService.getInstance()
		return new ProviderInfoDataAggregator(
			await RandAODataService.autoConfiguration()
		)
	}
	/**
	 * Get all aggregated provider data
	 */
	public getAggregatedData(): ProviderInfoAggregate[] {
		return Array.from(this.aggregateMap.values());
	}

	/**
	 * Initialize or get a provider entry in the aggregate map
	 * @param providerId The provider ID to initialize
	 * @returns The provider entry
	 */
	private getOrInitializeProvider(providerId: string): ProviderInfoAggregate {
		let entry = this.aggregateMap.get(providerId);
		if (!entry) {
			entry = { providerId };
			this.aggregateMap.set(providerId, entry);
		}
		return entry;
	}

	/**
	 * Update provider data based on the item type
	 * Also triggers message count update if not already processed
	 * @param item The provider data item
	 */
	public async updateProviderData(item: ProviderInfo | ProviderActivity): Promise<void> {
		const providerId = item.provider_id;
		const entry = this.getOrInitializeProvider(providerId);

		// Update data based on type
		if ('staked' in item) {
			entry.providerActivity = item;
		} else {
			entry.providerInfo = item;
		}

		// Update message count if not already processed
		if (!this.processedProviderIds.has(providerId)) {
			const totalFullfullilled = await this.randaoDataService.getProviderTotalFullfilledCount(providerId);
			entry.totalFullfullilled = totalFullfullilled;
			this.processedProviderIds.add(providerId);
		}

		this.aggregateMap.set(providerId, entry);
	}
}
