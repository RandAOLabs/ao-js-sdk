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
 * Interface for setting delegation preferences
 */
export interface SetDelegationOptions {
    /** The wallet address for which to set delegations */
    wallet: string;
    /** Array of delegation preferences (walletTo and factor pairs) */
    delegationPrefs: DelegationPreference[];
    /** Total factor value, defaults to 10000 (100%) */
    totalFactor?: number;
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
     * Gets delegation information for the specified wallet.
     * @param walletAddress Optional wallet address to get delegations for. If not provided, uses the wallet specified in the configuration.
     * @returns Promise resolving to delegation information details
     */
    getDelegation(walletAddress?: string): Promise<string>;
    
    /**
     * Sets delegation preferences for the specified wallet.
     * @param options Options for setting delegation preferences including wallet address, delegation preferences, and total factor
     * @returns Promise resolving to a string with the result of the operation
     */
    setDelegation(options: SetDelegationOptions): Promise<string>;
    
    /**
     * Parse the raw delegation info string into a structured object
     * @param delegationData Raw delegation data string
     * @returns Parsed delegation information
     */
    parseDelegationInfo(delegationData: string): DelegationInfo;
}
