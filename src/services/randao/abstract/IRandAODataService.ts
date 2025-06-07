
import { Observable } from "rxjs";
import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { BlockHeightFilterParams } from "./params";

/**
 * Interface for the RandAO Service
 */
export interface IRandAODataService {
    /**
     * Count random responses with optional timestamp filters
     * @param params Optional parameters including timestamp filters
     * @returns Promise resolving to the count of matching responses
     */
    /**
     * Count random responses with optional block height filters
     * @param params Optional parameters including block height filters
     * @returns Promise resolving to the count of matching responses
     */
    countRandomResponses(params: BlockHeightFilterParams): Promise<number>;
	/**
	 * Streams all random response messages from a specific random process
	 * @returns Observable that emits arrays of messages as they are fetched
	 */
	streamRandomResponseMessages(): Observable<ArweaveTransaction[]>;

	/**
	 * @returns number of completed random responses
	 */
	getTotalRandomResponses(): Promise<number>

	/**
	 * @returns number of fullfilled random requests for a given provider id
	 */
	getProviderTotalFullfilledCount(providerId: string): Promise<number>

	/**
	 * Query all messages with specific random process response tags
	 * @param randomProcessId The process ID to query messages for
	 * @returns Observable that emits arrays of messages as they are fetched
	 */
	queryRandomResponseMessages(randomProcessId: string): Observable<ArweaveTransaction[]>
}
