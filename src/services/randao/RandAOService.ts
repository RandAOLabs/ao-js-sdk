import { ProviderProfileClient, RandomClient } from "../../clients";
import { IRandAOService } from "./abstract";
import { from, lastValueFrom } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { ProviderInfoAggregate } from "./abstract/types";
import { ProviderInfoDataAggregator } from "./ProviderInfoDataAggregator";
import { IAutoconfiguration, staticImplements } from "../../utils";

/**
 * Service for handling RandAO operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAOService implements IRandAOService {
	constructor(
		private readonly randomClient: RandomClient,
		private readonly providerProfileClient: ProviderProfileClient,
	) { }

	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static async autoConfiguration(): Promise<IRandAOService> {
		return new RandAOService(
			await RandomClient.autoConfiguration(),
			ProviderProfileClient.autoConfiguration()
		);
	}

	async getAllProviderInfo(): Promise<ProviderInfoAggregate[]> {
		// Initialize aggregator
		const aggregator = await ProviderInfoDataAggregator.autoConfiguration()

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
		const aggregator = await ProviderInfoDataAggregator.autoConfiguration()

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
			return { providerId } // No Provider data found for this 
		}

		// Get the aggregated data for this specific provider
		const allData = aggregator.getAggregatedData();

		return allData[0]; // Return the first (and should be only) item
	}
}
