import { Observable } from "rxjs";
import { TokenBalance } from "../../../models/token-balance";

/**
 * Service for managing and retrieving portfolio data.
 */
export interface IPortfolioService {
	/**
	 * Gets all tokens for a given entity
	 * @param entityId The entity ID (user/wallet address)
	 * @returns Observable of currency amounts
	 */
	getTokens$(entityId: string): Observable<TokenBalance[]>;

	/**
	 * Gets total portfolio value in specified currency
	 * @param entityId The entity ID (user/wallet address)
	 * @param baseCurrency Base currency for value calculation
	 * @returns Observable resolving to total portfolio value
	 */
	getTotalValue$(entityId: string, baseCurrency?: string): Observable<string>;
}
