import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

/**
 * Represents the delegation preferences for a PI token.
 */
export interface DelegationPreference {
    walletTo: string;
    factor: number;
}

/**
 * Represents the complete delegation information.
 */
export interface DelegationInfo {
    totalFactor: string;
    delegationPrefs: DelegationPreference[];
    lastUpdate: number;
    wallet: string;
}

/**
 * Interface for interacting with the PI delegate process.
 */
export interface IPIDelegateClient {
    /**
     * Gets information from the delegate process.
     * @returns Promise resolving to a DryRunResult with delegation information
     */
    getInfo(): Promise<DryRunResult>;

    /**
     * Gets delegation information.
     * @returns Promise resolving to delegation information details
     */
    getDelegation(): Promise<string>;
    
    /**
     * Parse the raw delegation info string into a structured object
     * @param delegationData Raw delegation data string
     * @returns Parsed delegation information
     */
    parseDelegationInfo(delegationData: string): DelegationInfo;
}
