/**
 * Common domains for querying using the ARIOService.
 * These domains are used to retrieve process IDs through ANT and ARNS record lookups.
 * 
 * Domain format can be either:
 * - "antname" (e.g., "randao")
 * - "undername_antname" (e.g., "api_randao")
 * 
 * @see {@link ARIOService.getProcessIdForDomain} for domain resolution logic
 */
export enum Domain {
    /**
     * Domain for the RANDAO API process.
     * Uses format "api_randao" where:
     * - "api" is the undername
     * - "randao" is the ANT name
     */
    RANDAO_API = "api_randao"
}
