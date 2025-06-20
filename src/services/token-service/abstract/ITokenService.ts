import { CreditNotice } from "../../credit-notices";
import { TokenBalance } from "./responses";

/**
 * Interface for token service operations
 */
export interface ITokenService {
	/**
	 * Gets all token balances with pagination
	 * @returns Promise resolving to an array of TokenBalance objects
	 */
	getAllBalances(): Promise<TokenBalance[]>;
	
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

	 */
	getTransactionVolume(from: Date, to: Date): Promise<bigint>;

	getAllCreditNoticesTo(entityId:string): Promise<CreditNotice[]>

	getProcessId(): string;
}
