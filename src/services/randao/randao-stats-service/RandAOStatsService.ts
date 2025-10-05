import { Observable, from, range } from 'rxjs';
import { map, mergeMap, concatMap, scan, toArray } from 'rxjs/operators';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { ServiceErrorHandler } from '../../../utils/decorators/serviceErrorHandler';
import { ARIOService, IARIOService } from '../../ario';
import { DOMAIN } from '../../ario/ario-service/domains';
import { CachingMessageService } from '../../messages/message-service/CachingMessageService';
import { IMessagesService } from '../../messages/message-service/abstract/IMessagesService';
import { ArweaveDataCachingService } from '../../../core/arweave/ArweaveDataCachingService';
import { IArweaveDataService } from '../../../core/arweave/abstract/IArweaveDataService';
import { ArweaveGQLBuilder } from '../../../core/arweave/gql/ArweaveGQLBuilder';
import { IRandAOStatsService, RandomStatsTimeEntry, TimePeriod } from './abstract';
import RANDOM_PROCESS_TAGS from '../../../clients/randao/random/tags';
import { SYSTEM_TAGS } from '../../../core/common/tags';
import { Service } from '../../common/Service';

/**
 * Service for handling RandAO statistics operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAOStatsService extends Service implements IRandAOStatsService {
	constructor(
		private readonly arioService: IARIOService,
		private readonly cachingMessageService: IMessagesService,
		private readonly arweaveDataService: IArweaveDataService,
	) {
		super();
	}

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static async autoConfiguration(): Promise<IRandAOStatsService> {
		return new RandAOStatsService(
			ARIOService.getInstance(),
			CachingMessageService.autoConfiguration(),
			ArweaveDataCachingService.autoConfiguration(),
		);
	}

	@ServiceErrorHandler
	async getTotalRandomnessCreated(): Promise<bigint> {
		const randomProcessId = await this.arioService.getProcessIdForDomain(DOMAIN.RANDAO_API);
		const count = await this.cachingMessageService.countAllMessages({
			tags: [
				RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
				SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
			]
		});
		return BigInt(count);
	}

	@ServiceErrorHandler
	getRandomCreatedOverTimeDaily$(): Observable<RandomStatsTimeEntry[]> {
		return this.getRandomCreatedOverTime(TimePeriod.DAILY);
	}

	@ServiceErrorHandler
	getRandomCreatedOverTimeWeekly$(): Observable<RandomStatsTimeEntry[]> {
		return this.getRandomCreatedOverTime(TimePeriod.WEEKLY);
	}

	@ServiceErrorHandler
	getRandomCreatedOverTimeMonthly$(): Observable<RandomStatsTimeEntry[]> {
		return this.getRandomCreatedOverTime(TimePeriod.MONTHLY);
	}

	@ServiceErrorHandler
	getRandomCreatedOverTimeYearly$(): Observable<RandomStatsTimeEntry[]> {
		return this.getRandomCreatedOverTime(TimePeriod.YEARLY);
	}

	/**
	 * Private helper method to get random creation statistics over time with the specified granularity
	 * @param period The time period granularity
	 * @returns Observable that emits accumulating arrays of RandomStatsTimeEntry objects
	 */
	private getRandomCreatedOverTime(period: TimePeriod): Observable<RandomStatsTimeEntry[]> {
		return from(this.arioService.getProcessIdForDomain(DOMAIN.RANDAO_API)).pipe(
			mergeMap(randomProcessId => {
				const timeRanges = this.generateTimeRanges(period);
				return from(timeRanges).pipe(
					mergeMap(timeRange =>
						from(this.getCountForTimeRange(randomProcessId, timeRange)).pipe(
							map(count => ({
								date: timeRange.start,
								count,
								// Add sorting key to maintain chronological order
								sortKey: timeRange.start.getTime()
							}))
						), 15 // Limit to 15 concurrent requests
					),
					// Collect all results first
					toArray(),
					// Sort by date to ensure chronological order
					map(results => results.sort((a, b) => a.sortKey - b.sortKey)),
					// Convert back to individual emissions for accumulating
					mergeMap(sortedResults => from(sortedResults)),
					// Remove the sorting key from the final result
					map((entry: any) => ({ date: entry.date, count: entry.count })),
					// Create accumulating arrays
					scan((accumulator: RandomStatsTimeEntry[], current: RandomStatsTimeEntry) => {
						return [...accumulator, current];
					}, [])
				);
			})
		);
	}

	/**
	 * Gets the count of random messages for a specific time range
	 * @param randomProcessId The random process ID
	 * @param timeRange The time range with start and end timestamps
	 * @returns Promise resolving to the count
	 */
	private async getCountForTimeRange(
		randomProcessId: string,
		timeRange: { start: Date; end: Date }
	): Promise<number> {
		try {
			// Convert dates to Unix timestamps in seconds (as expected by Arweave)
			const startTimestamp = Math.floor(timeRange.start.getTime() / 1000);
			const endTimestamp = Math.floor(timeRange.end.getTime() / 1000);

			const builder = new ArweaveGQLBuilder()
				.tags([
					RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
					SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
				])
				.minIngestedAt(startTimestamp)
				.maxIngestedAt(endTimestamp)
				.count();

			const response = await this.arweaveDataService.query(builder);
			return parseInt(response.data.transactions.count as string);
		} catch (error) {
			// If there's an error, return 0 for this time range
			return 0;
		}
	}

	/**
	 * Generates time ranges based on the specified period, starting from January 1, 2025
	 * @param period The time period granularity
	 * @returns Array of time ranges with start and end dates
	 */
	private generateTimeRanges(period: TimePeriod): { start: Date; end: Date }[] {
		const startDate = new Date(2025, 0, 1); // January 1, 2025
		const now = new Date();
		const ranges: { start: Date; end: Date }[] = [];

		let currentDate = new Date(startDate);
		let periodIndex = 0;

		// Generate periods from January 1, 2025 until current date
		while (currentDate <= now) {
			const { start, end } = this.getPeriodRangeFromStart(startDate, period, periodIndex);

			// Only add the range if it's not in the future
			if (start <= now) {
				ranges.push({ start, end });
			}

			// Move to next period
			switch (period) {
				case TimePeriod.DAILY:
					currentDate.setDate(currentDate.getDate() + 1);
					break;
				case TimePeriod.WEEKLY:
					currentDate.setDate(currentDate.getDate() + 7);
					break;
				case TimePeriod.MONTHLY:
					currentDate.setMonth(currentDate.getMonth() + 1);
					break;
				case TimePeriod.YEARLY:
					currentDate.setFullYear(currentDate.getFullYear() + 1);
					break;
			}
			periodIndex++;

			// Safety check to prevent infinite loops
			if (periodIndex > 1000) break;
		}

		return ranges;
	}

	/**
	 * Gets the start and end dates for a specific period starting from January 1, 2025
	 * @param startDate The start date (January 1, 2025)
	 * @param period The period type
	 * @param offset The number of periods to add from the start date
	 * @returns Object with start and end dates
	 */
	private getPeriodRangeFromStart(startDate: Date, period: TimePeriod, offset: number): { start: Date; end: Date } {
		const start = new Date(startDate);
		const end = new Date(startDate);

		switch (period) {
			case TimePeriod.DAILY:
				start.setDate(start.getDate() + offset);
				start.setHours(0, 0, 0, 0);
				end.setDate(end.getDate() + offset);
				end.setHours(23, 59, 59, 999);
				break;
			case TimePeriod.WEEKLY:
				// Start from the first Monday of 2025 or January 1 if it's a Monday
				const firstMondayOffset = (8 - startDate.getDay()) % 7; // Days to first Monday
				start.setDate(startDate.getDate() + firstMondayOffset + (offset * 7));
				start.setHours(0, 0, 0, 0);
				end.setDate(start.getDate() + 6);
				end.setHours(23, 59, 59, 999);
				break;
			case TimePeriod.MONTHLY:
				start.setMonth(startDate.getMonth() + offset);
				start.setDate(1);
				start.setHours(0, 0, 0, 0);
				end.setMonth(start.getMonth() + 1);
				end.setDate(0); // Last day of the month
				end.setHours(23, 59, 59, 999);
				break;
			case TimePeriod.YEARLY:
				start.setFullYear(startDate.getFullYear() + offset);
				start.setMonth(0);
				start.setDate(1);
				start.setHours(0, 0, 0, 0);
				end.setFullYear(start.getFullYear());
				end.setMonth(11);
				end.setDate(31);
				end.setHours(23, 59, 59, 999);
				break;
		}

		return { start, end };
	}
}
