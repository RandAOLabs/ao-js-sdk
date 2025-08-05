/**
 * Parameters for retrieving portfolio tokens
 */
export interface GetTokensParams {
	/**
	 * The entity ID (user/wallet address)
	 */
	entityId: string;

	/**
	 * Optional filter for specific token types
	 */
	tokenTypes?: string[];

	/**
	 * Whether to include zero balances
	 */
	includeZeroBalances?: boolean;

	/**
	 * Whether to include price information
	 */
	includePrices?: boolean;
}

/**
 * Parameters for retrieving portfolio summary
 */
export interface GetPortfolioSummaryParams {
	/**
	 * The entity ID (user/wallet address)
	 */
	entityId: string;

	/**
	 * Base currency for value calculations
	 */
	baseCurrency?: string;

	/**
	 * Whether to include performance metrics
	 */
	includePerformance?: boolean;
}

/**
 * Parameters for retrieving token balance
 */
export interface GetTokenBalanceParams {
	/**
	 * The entity ID (user/wallet address)
	 */
	entityId: string;

	/**
	 * The token identifier/address
	 */
	tokenId: string;

	/**
	 * Whether to include current price
	 */
	includePrice?: boolean;
}
