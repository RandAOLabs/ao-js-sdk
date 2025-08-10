/**
 * Configuration for a token including metadata and identification.
 */
export interface TokenConfig {
	/**
	 * Transaction ID for the token's logo image.
	 */
	logoTxId?: string;

	/**
	 * Display name of the token.
	 */
	name?: string;

	/**
	 * Process ID of the token.
	 */
	tokenProcessId?: string;

	/**
	 * Process ID of the token.
	 */
	denomination?: number;
}
