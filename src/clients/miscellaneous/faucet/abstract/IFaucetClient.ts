/**
 * Interface for the Faucet Client that provides functionality for managing faucets
 * and viewing faucet pulls.
 */
export interface IFaucetClient {
	/**
	 * Request tokens from the faucet.
	 * @returns Promise resolving to true if successful
	 */
	useFaucet(): Promise<Boolean>;
}
