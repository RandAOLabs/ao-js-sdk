import { Observable } from 'rxjs';
import { RandomStatsTimeEntry } from './types';

/**
 * Interface for the RandAO Statistics Service
 * @category RandAO
 */
export interface IRandAOStatsService {
	/**
	 * Gets the total count of randomness created across all time
	 * @returns Promise resolving to the total number of random responses created
	 */
	getTotalRandomnessCreated(): Promise<bigint>;

	/**
	 * Streams daily randomness creation statistics over time as an accumulating array
	 * @returns Observable that emits accumulating arrays of daily random creation statistics
	 */
	getRandomCreatedOverTimeDaily$(): Observable<RandomStatsTimeEntry[]>;

	/**
	 * Streams weekly randomness creation statistics over time as an accumulating array
	 * @returns Observable that emits accumulating arrays of weekly random creation statistics
	 */
	getRandomCreatedOverTimeWeekly$(): Observable<RandomStatsTimeEntry[]>;

	/**
	 * Streams monthly randomness creation statistics over time as an accumulating array
	 * @returns Observable that emits accumulating arrays of monthly random creation statistics
	 */
	getRandomCreatedOverTimeMonthly$(): Observable<RandomStatsTimeEntry[]>;

	/**
	 * Streams yearly randomness creation statistics over time as an accumulating array
	 * @returns Observable that emits accumulating arrays of yearly random creation statistics
	 */
	getRandomCreatedOverTimeYearly$(): Observable<RandomStatsTimeEntry[]>;
}
