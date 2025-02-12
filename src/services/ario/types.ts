/**
 * Request parameters for retrieving an ARNS record
 */
export interface ArNSRecordRequest {
    /**
     * The name to get the ARNS record for.
     * Can be either a simple domain (e.g., "randao") or a compound domain (e.g., "nft_randao")
     */
    name: string;
}
