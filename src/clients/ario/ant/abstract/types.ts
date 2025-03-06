import { BaseClientConfig } from "src/core/ao/configuration/BaseClientConfig";

/**
 * Represents a single ANT (Arweave Name Token) record
 */
export interface ANTRecord {
    /**
     * The transaction ID associated with this ANT record
     */
    transactionId: string;

    /**
     * The name of the ANT record
     */
    name: string;

    /**
     * Optional metadata associated with the ANT record
     */
    metadata?: Record<string, any>;
}

/**
 * A collection of ANT records indexed by their names
 */
export interface ANTRecords {
    [key: string]: ANTRecord;
}