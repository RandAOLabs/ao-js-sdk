import { MonthlyRandomResponses } from "./statsTypes";

/**
 * Interface for RandAO statistics service
 */
export interface IRandAOStatsService {
    /**
     * Gets the count of random responses grouped by month
     * @returns Promise of an array of monthly response counts
     */
    getMonthlyResponseCounts(): Promise<MonthlyRandomResponses[]>;
}
