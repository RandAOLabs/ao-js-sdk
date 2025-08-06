import { Observable } from "rxjs";
import { TokenBalance } from "../../../models/token-balance";
import { Portfolio } from "../../../models/portfolio";
import { ICurrencyAmount } from "../../../models";

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

	getPortfolio$(entityId: string): Observable<Portfolio>;

	calculatePortfolioWorthUSD$(portfolio: Observable<Portfolio>): Observable<ICurrencyAmount>;
}
