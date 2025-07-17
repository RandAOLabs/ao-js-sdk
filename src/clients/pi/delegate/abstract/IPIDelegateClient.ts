import { DryRunResult } from "../../../../core/ao/abstract";

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
 * Interface for setting a single delegation preference
 */
export interface SetDelegationOptions {
	/** The wallet address from which the delegation is made (typically the user's wallet) */
	walletFrom: string;
	/** The wallet address to delegate to */
	walletTo: string;
	/** Factor value representing delegation strength (basis points, out of 10000) */
	factor: number;
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
