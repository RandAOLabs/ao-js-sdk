import { ARNSRecord } from "./types";

/**
 * Interface for ARNS (Arweave Name Service) client operations
 */
export interface IARNSClient {
    /**
     * Retrieves an ARNS record for a given name
     * @param name - The name to get the ARNS record for
     * @returns Promise resolving to the ARNS record if found, undefined otherwise
     */
    getRecord(name: string): Promise<ARNSRecord | undefined>;

    /**
     * Gets the process ID for this client
     * @returns The process ID string
     */
    getProcessId(): string;
}
