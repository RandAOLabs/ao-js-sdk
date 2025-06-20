
/**
 * Represents detailed Token information
 */
export interface TokenInfo {
    /** Data protocol identifier */
    dataProtocol?: string;
    /** Token variant */
    variant?: string;
    /** Message type */
    type?: string;
    /** Reference identifier */
    reference?: string;
    /** Action type */
    action?: string;
    /** Token logo */
    logo?: string;
    /** Total token supply */
    totalSupply?: string;
    /** Token name */
    name?: string;
    /** Token ticker symbol */
    ticker?: string;
    /** Token denomination (decimal places) */
    denomination?: string;
    /** Whether transfers are restricted */
    transferRestricted?: string;
}
