/**
 * @categoryDescription Core
 * Core Functionality for interacting with Arweave/AO
 * @showCategories
 * @module
 */

import { ProcessEndpoint, HyperbeamRequestOptions } from './types';

/**
 * Interface for HyperBEAM client that provides access to AO-Core process state
 */
export interface IHyperbeamClient {
	/**
	 * Retrieves the state of a specific process from the HyperBEAM node using a specified endpoint
	 *
	 * @param processId The process ID to query
	 * @param endpoint The process endpoint to use (compute or now)
	 * @param additionalPath Optional additional path components to access specific data within the process state
	 * @returns Promise resolving to the process state data
	 *
	 * @example
	 * ```typescript
	 * // Get cached process state with specific path
	 * const state = await client.getProcessState('process-id', ProcessEndpoint.COMPUTE, 'balances/wallet-address');
	 *
	 * // Get real-time process state
	 * const freshState = await client.getProcessState('process-id', ProcessEndpoint.NOW);
	 * ```
	 */
	getProcessState(processId: string, endpoint: ProcessEndpoint, additionalPath?: string): Promise<any>;

	/**
	 * Retrieves the cached state of a specific process from the HyperBEAM node (compute endpoint)
	 *
	 * This is a convenience method that uses the compute endpoint for faster, cached responses.
	 *
	 * @param processId The process ID to query
	 * @param additionalPath Optional additional path components to access specific data within the process state
	 * @returns Promise resolving to the process state data
	 *
	 * @example
	 * ```typescript
	 * // Get cached process state (fastest)
	 * const state = await client.compute('process-id');
	 *
	 * // Get specific data from cached process state
	 * const balances = await client.compute('process-id', 'balances/wallet-address');
	 * ```
	 */
	compute(processId: string, additionalPath?: string): Promise<any>;
}
