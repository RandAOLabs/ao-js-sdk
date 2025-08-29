import { TokenBalance } from '../../token-balance/TokenBalance';

/**
 * Interface for Credit objects that represent financial credit transactions
 */
export interface ICredit {
	/**
	 * Gets the token balance associated with this credit
	 * @returns The TokenBalance representing the credited amount
	 */
	getTokenBalance(): TokenBalance;

	/**
	 * Gets the transaction date when the credit occurred
	 * @returns The date of the credit transaction
	 */
	getTransactionDate(): Date;

	/**
	 * Gets the account that was credited
	 * @returns The address/ID of the credited account
	 */
	getAccountCredited(): string;

	/**
	 * Gets the account that was debited
	 * @returns The address/ID of the debited account
	 */
	getAccountDebited(): string;

	/**
	 * Gets the unique identifier for this credit
	 * @returns The credit ID
	 */
	getId(): string;

	/**
	 * Gets the process ID that originated this credit
	 * @returns The process ID
	 */
	getFromProcess(): string;

	toString(): string;
}
