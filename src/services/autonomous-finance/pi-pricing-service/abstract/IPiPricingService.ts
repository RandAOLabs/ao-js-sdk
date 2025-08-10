/**
 * Service for retrieving PI pricing data.
 */
export interface IPiPricingService {
	/**
	 * Gets the current price of PI token
	 * @returns Promise resolving to the current PI price
	 */
	getCurrentPrice(): Promise<string>;

	/**
	 * Gets historical price data for PI token
	 * @param fromTimestamp Start timestamp for historical data
	 * @param toTimestamp End timestamp for historical data
	 * @returns Promise resolving to historical price data
	 */
	getHistoricalPrices(fromTimestamp: number, toTimestamp: number): Promise<any[]>;

	/**
	 * Gets price statistics for PI token
	 * @returns Promise resolving to price statistics
	 */
	getPriceStatistics(): Promise<any>;
}
