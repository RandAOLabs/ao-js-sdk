import { ARNSRecordResponse, GetArNSRecordsResponse } from "./responseTypes";
import { GetArNSRecordsParams } from "./params";

/**
 * Interface for ARNS (Arweave Name Service) client operations
 */
export interface IARNSClient {
	/**
	 * Retrieves an ARNS record for a given name
	 * @param name - The name to get the ARNS record for
	 * @returns Promise resolving to the ARNS record if found, undefined otherwise
	 */
	getRecord(name: string): Promise<ARNSRecordResponse | undefined>;

	/**
	 * Retrieves paginated ARNS records
	 * @param params - Optional pagination parameters (cursor and limit)
	 * @returns Promise resolving to paginated ARNS records response
	 */
	getArNSRecords(params?: GetArNSRecordsParams): Promise<GetArNSRecordsResponse>;

	/**
	 * Gets the process ID for this client
	 * @returns The process ID string
	 */
	getProcessId(): string;
}
