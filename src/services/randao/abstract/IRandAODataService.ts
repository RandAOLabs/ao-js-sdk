/**
 * Interface for the RandAO Service
 */
export interface IRandAODataService {
	/**
	 * @returns number of completed random responses
	 */
	getTotalRandomResponses(): Promise<number>

	/**
	 * @returns number of fullfilled random requests for a given provider id
	 */
	getProviderTotalFullfilledCount(providerId: string): Promise<number>

	/**
	 * Gets the most recent random response
	 * @returns Promise of the most recent random response
	 */
	getMostRecentRandomResponse(): Promise<any>
}
