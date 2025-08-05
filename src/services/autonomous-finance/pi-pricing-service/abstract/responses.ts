/**
 * Represents a price data point
 */
export interface PriceData {
	/**
	 * The timestamp of the price data
	 */
	timestamp: number;

	/**
	 * The price value
	 */
	price: string;

	/**
	 * The volume at this price point
	 */
	volume?: string;
}

/**
 * Represents price statistics
 */
export interface PriceStatistics {
	/**
	 * Current price
	 */
	currentPrice: string;

	/**
	 * 24-hour high price
	 */
	high24h: string;

	/**
	 * 24-hour low price
	 */
	low24h: string;

	/**
	 * 24-hour price change
	 */
	change24h: string;

	/**
	 * 24-hour price change percentage
	 */
	changePercent24h: string;

	/**
	 * 24-hour trading volume
	 */
	volume24h: string;

	/**
	 * Market cap
	 */
	marketCap?: string;
}
