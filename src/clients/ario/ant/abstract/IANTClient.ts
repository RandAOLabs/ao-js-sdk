import { ANTRecord, ANTRecords } from "./types";

/**
 * Interface for ANT (Arweave Name Token) client operations
 */
export interface IANTClient {
    /**
     * Retrieves all ANT records
     * @returns Promise resolving to a record of ANT records
     */
    getRecords(): Promise<ANTRecords>;

    /**
     * Retrieves a specific ANT record by name
     * @param name - The name of the ANT record to retrieve
     * @returns Promise resolving to the ANT record if found, undefined otherwise
     */
    getRecord(name: string): Promise<ANTRecord | undefined>;

}
