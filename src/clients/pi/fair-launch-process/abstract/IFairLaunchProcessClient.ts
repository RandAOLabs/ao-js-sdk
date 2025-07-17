import { FairLaunchInfo } from "../types";

/**
 * Interface for interacting with a Fair Launch Process.
 */
export interface IFairLaunchProcessClient {
	/**
	 * Gets information about the Fair Launch Process.
	 * @returns Promise resolving to a DryRunResult with process information
	 */
	getInfo(): Promise<FairLaunchInfo>;
}
