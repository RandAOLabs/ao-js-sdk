import { BaseClientConfig } from "src/core/ao/abstract/BaseClientConfig";

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

/**
 * Configuration for the ARNS client
 * @extends BaseClientConfig
 */
export interface ARNSClientConfig extends BaseClientConfig {
    /**
     * The process ID for the ARNS service
     */
    processId: string;
}
