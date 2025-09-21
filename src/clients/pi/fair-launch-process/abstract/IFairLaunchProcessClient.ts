import { FairLaunchInfo, ProceedsData } from "../types";

/**
 * Interface for interacting with a Fair Launch Process.
 */
export interface IFairLaunchProcessClient {
	/**
	 * Gets information about the Fair Launch Process.
	 * @returns Promise resolving to a DryRunResult with process information
	 */
	getInfo(): Promise<FairLaunchInfo>;

	/**
	 * Gets the withdrawable AO amount for a specific time.
	 * @param time Optional timestamp to check withdrawable amount at (defaults to current time)
	 * @returns Promise resolving to withdrawable AO amount as string
	 */
	getWithdrawableAo(time?: number): Promise<string>;

	/**
	 * Gets the withdrawable PI amount for a specific time.
	 * @param time Optional timestamp to check withdrawable amount at (defaults to current time)
	 * @returns Promise resolving to withdrawable PI amount as string
	 */
	getWithdrawablePi(time?: number): Promise<string>;

	/**
	 * Withdraws available AO tokens to the treasury.
	 * Only the deployer can perform this action.
	 * @returns Promise resolving to the withdrawal result
	 */
	withdrawAo(): Promise<any>;

	/**
	 * Withdraws available PI tokens to the treasury.
	 * Only the deployer can perform this action.
	 * @returns Promise resolving to the withdrawal result
	 */
	withdrawPi(): Promise<any>;

	/**
	 * Gets AO proceeds data for all yield cycles.
	 * @returns Promise resolving to proceeds data indexed by yield cycle
	 */
	getAoProceeds(): Promise<ProceedsData>;

	/**
	 * Gets PI proceeds data for all yield cycles.
	 * @returns Promise resolving to proceeds data indexed by yield cycle
	 */
	getPiProceeds(): Promise<ProceedsData>;
}
