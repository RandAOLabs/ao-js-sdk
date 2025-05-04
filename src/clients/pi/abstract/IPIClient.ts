import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

/**
 * Interface for interacting with PI token processes.
 */
export interface IPIClient {
    /**
     * Gets information about a PI token process.
     * These are parameters set when the token process was spawned.
     * @returns Promise resolving to a DryRunResult with token information
     */
    getInfo(): Promise<DryRunResult>;
    
    /**
     * Gets information from the PI token process.
     * @returns Promise resolving to a DryRunResult with token information
     */
    getPITokenInfo(): Promise<DryRunResult>;
    
    /**
     * Gets information from the delegate process.
     * @returns Promise resolving to a DryRunResult with delegation information
     */
    getDelegateInfo(): Promise<DryRunResult>;

    /**
     * Gets delegation information.
     * @returns Promise resolving to delegation information details
     */
    getDelegation(): Promise<string>;
    
    /**
     * Gets yield tick history information.
     * @returns Promise resolving to tick history data
     */
    getTickHistory(): Promise<string>;
    
    /**
     * Gets available PI tokens.
     * @returns Promise resolving to a list of PI tokens
     */
    getPITokens(): Promise<string>;
    
    /**
     * Gets the balance from the PI token process.
     * @param target Optional target wallet address. If not provided, uses the calling wallet address.
     * @returns Promise resolving to the balance as a string
     */
    getBalance(target?: string): Promise<string>;
    
    /**
     * Gets the claimable balance from the PI token process.
     * @returns Promise resolving to the claimable balance as a string
     */
    getClaimableBalance(): Promise<string>;
}
