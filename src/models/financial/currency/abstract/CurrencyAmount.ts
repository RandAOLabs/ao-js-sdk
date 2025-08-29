/**
 * Interface for representing currency amounts with precise decimal handling.
 * Provides methods for accessing the raw amount, decimal precision, and various formatting options.
 */
export interface ICurrencyAmount {
	/**
	 * Gets the raw amount as a bigint value.
	 * This represents the amount in the smallest unit (e.g., wei for ETH, satoshis for BTC).
	 * @returns The raw amount as a bigint
	 */
	amount(): bigint

	/**
	 * Gets the number of decimal places for this currency.
	 * @returns The number of decimal places
	 */
	decimals(): number

	/**
	 * Converts the currency amount to a string representation.
	 * @returns String representation of the amount
	 */
	toString(): string

	/**
	 * Formats the currency amount to a string with a specified number of decimal places.
	 * @param decimalPlaces The number of decimal places to display
	 * @returns Formatted string with the specified decimal places
	 */
	toFixed(decimalPlaces: number): string

	/**
	 * Formats the currency amount using abbreviated notation (K, M, B, T).
	 * Examples: 1,500 -> "1.5K", 2,500,000 -> "2.5M", 1,000,000,000 -> "1B"
	 * @param decimalPlaces Optional number of decimal places for the abbreviated value (default: 1)
	 * @returns Formatted string with K/M/B/T suffix
	 */
	toAbbreviated(decimalPlaces?: number): string
}
