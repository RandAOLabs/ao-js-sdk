/**
 * Interface for AO JS SDK data service operations
 * @category Service
 */
export interface IAoJsSdkDataService {
	/**
	 * Gets the total count of all AO JS messages
	 * @returns Promise that resolves to the total number of AO JS messages
	 */
	getTotalAoJsMessages(): Promise<string>;
}
