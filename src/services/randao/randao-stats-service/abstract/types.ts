/**
 * Enum representing different time period granularities for statistics
 */
export enum TimePeriod {
	DAILY = "daily",
	WEEKLY = "weekly",
	MONTHLY = "monthly",
	YEARLY = "yearly"
}

/**
 * Represents a time-based entry for random statistics
 */
export interface RandomStatsTimeEntry {
	/**
	 * The date/timestamp for this statistical entry
	 */
	date: Date;

	/**
	 * The count of random responses created during this time period
	 */
	count: number;
}
