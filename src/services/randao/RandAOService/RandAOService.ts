import { ProviderProfileClient, RandomClient } from "../../../clients";
import { IRandAOService } from "./abstract";
import { from, lastValueFrom } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { ProviderInfoDataAggregator } from "../RandAODataService/ProviderInfoDataAggregator";
import { IAutoconfiguration } from "../../../utils";
import { staticImplements } from "../../../utils/decorators";
import { IRandAODataService, ProviderInfoAggregate } from "../RandAODataService/abstract";
import { RandAODataService } from "../RandAODataService";

/**
 * Service for handling RandAO operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAOService implements IRandAOService {
	constructor(
		private readonly randomClient: RandomClient,
		private readonly providerProfileClient: ProviderProfileClient,
		private readonly randAODataService: IRandAODataService,
	) { }

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static async autoConfiguration(): Promise<IRandAOService> {
		return new RandAOService(
			await RandomClient.autoConfiguration(),
			ProviderProfileClient.autoConfiguration(),
			await RandAODataService.autoConfiguration()
		);
	}

	async getAllProviderInfo(): Promise<ProviderInfoAggregate[]> {
		// Initialize aggregator
		const aggregator = await ProviderInfoDataAggregator.autoConfiguration();

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

	async getAllInfoForProvider(providerId: string): Promise<ProviderInfoAggregate> {
		// Initialize aggregator
		const aggregator = await ProviderInfoDataAggregator.autoConfiguration();

		let activityStream;
		let infoStream;
		try {
			// Create and process streams
			activityStream = from(this.randomClient.getProviderActivity(providerId)).pipe(
				mergeMap(async item => {
					await aggregator.updateProviderData(item);
				})
			);

			infoStream = from(this.providerProfileClient.getProviderInfo(providerId)).pipe(
				mergeMap(async item => {
					await aggregator.updateProviderData(item);
				})
			);


			// Wait for completion
			await Promise.all([
				lastValueFrom(activityStream),
				lastValueFrom(infoStream)
			]);
		} catch (error: any) {
			return { providerId, owner: '' } // No Provider data found for this
		}

		// Get the aggregated data for this specific provider
		const allData = aggregator.getAggregatedData();

		return allData[0]; // Return the first (and should be only) item
	}

	async getMostRecentEntropy(): Promise<string> {
		try {
			const mostRecentResponse = await this.randAODataService.getMostRecentRandomResponse();

			if (!mostRecentResponse) {
				throw new Error('No random response found');
			}

			// Extract entropy from the response data
			// Assuming the entropy is in the data field or tags
			if (mostRecentResponse.data && mostRecentResponse.data.entropy) {
				return mostRecentResponse.data.entropy;
			}

			// Check if entropy is in tags
			const entropyTag = mostRecentResponse.tags?.find((tag: any) => tag.name === 'Entropy' || tag.name === 'entropy');
			if (entropyTag) {
				return entropyTag.value;
			}

			// If no specific entropy field, use the transaction ID as fallback
			return mostRecentResponse.id || '';
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to get most recent entropy: ${errorMessage}`);
		}
	}
}
