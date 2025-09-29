import { CreditNotice } from "../../credit-notices";
import { CurrencyAmount } from "../../../models/financial/currency/CurrencyAmount";
import { TokenBalanceS } from "./responses";

/**
 * Interface for token service operations
 */
export interface ITokenService {
	/**
	 * Gets all token balances with pagination
	 * @returns Promise resolving to an array of TokenBalance objects
	 */
	getAllBalances(): Promise<TokenBalanceS[]>;

	/**
	 * Gets the balance for a specific address
	 * @param address The address to get the balance for
	 * @returns Promise resolving to the balance as a bigint
	 */
	getBalance(address: string): Promise<bigint>;

	/**
	 * Gets the total number of token holders (addresses with positive balances)
	 * @returns Promise resolving to the number of holders
	 */
	getTotalHolders(): Promise<number>;

	/**
	 * Gets the transaction volume for a date range
	 */
	getTransactionVolume(from: Date, to: Date): Promise<bigint>;

	getAllCreditNoticesTo(entityId: string): Promise<CreditNotice[]>

	getProcessId(): string;

	/**
	 * Evenly disperses tokens among the provided wallet addresses
	 * @param amount The total amount to disperse
	 * @param wallets Array of wallet addresses to receive tokens
	 * @returns Promise resolving to an array of transaction IDs
	 */
	disperseTokens(amount: CurrencyAmount, wallets: string[]): Promise<string[]>;
}
