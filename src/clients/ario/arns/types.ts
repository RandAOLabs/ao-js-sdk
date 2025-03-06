import { BaseClientConfig } from "src/core/ao/configuration/BaseClientConfig";

/**
 * Represents an ARNS (Arweave Name Service) record
 */
export interface ARNSRecord {
    /**
     * The name associated with this ARNS record
     */
    name: string;

    /**
     * The process ID associated with this ARNS record
     */
    processId: string;

    /**
     * Optional metadata associated with the ARNS record
     */
    metadata?: Record<string, any>;
}


export interface ARNSClientConfig extends BaseClientConfig {
}

/**
 * Request parameters for retrieving an ARNS record
 */
export interface ARNSRecordRequest {
    /**
     * The name to get the ARNS record for.
     * Can be either a simple domain (e.g., "randao") or a compound domain (e.g., "nft_randao")
     */
    name: string;
}
