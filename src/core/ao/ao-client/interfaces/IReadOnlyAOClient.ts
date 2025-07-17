
import { DryRunResult, MessageInput, MessageResult, ReadResultArgs, ReadResultsArgs, ResultsResponse } from '../../abstract';
import { ConnectArgsLegacy } from '../aoconnect-types';

/**
 * AO interface provides a wrapper for interacting with the Arweave Operating System (AO).
 * This interface encapsulates all core AO functionality from @permaweb/aoconnect, providing
 * a clean interface for sending messages, retrieving results, and performing dry runs.
 */
export interface IReadOnlyAOClient {
	/**
	 * Retrieves results from an AO process.
	 * @param process - The target process ID
	 * @param from - Optional starting point for results
	 * @param to - Optional ending point for results
	 * @param limit - Maximum number of results to return (default: 25)
	 * @param sort - Sort order for results (default: ASCENDING)
	 * @returns Promise resolving to the results response
	 */
	results(params: ReadResultsArgs): Promise<ResultsResponse>;

	/**
	 * Retrieves the result of a specific message.
	 * @param process - The target process ID
	 * @param messageId - The ID of the message to get results for
	 * @returns Promise resolving to the message result
	 */
	result(params: ReadResultArgs): Promise<MessageResult>;

	/**
	 * Performs a dry run of a message without actually sending it.
	 * @param params - The dry run parameters
	 * @returns Promise resolving to the dry run result
	 */
	dryrun(params: MessageInput): Promise<DryRunResult>;

	/**
	 * Gets the active AO Config for this client.
	 * @returns The Active AO Config which will be used for the next query, however may or may not have been used for previous queries.
	 */
	getActiveConfig(): ConnectArgsLegacy;
}
