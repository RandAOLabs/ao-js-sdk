import { ArweaveNodeType } from './types';
import { IArweaveNodeClient } from './IArweaveNodeClient';


/**
 * Type definition for the ArweaveNodeFactory
 */
export interface IArweaveNodeFactory {
	/**
	 * Creates or returns wrapped ArweaveNode instance for the specified node type
	 * @param nodeType The type of Arweave node configuration to use
	 * @returns ArweaveNode wrapper instance configured for the specified node type
	 */
	getNode(nodeType: ArweaveNodeType): IArweaveNodeClient;

	/**
	 * Checks if a node instance exists for the given type
	 * @param nodeType The type of Arweave node configuration to check
	 * @returns True if instance exists, false otherwise
	 */
	hasInstance(nodeType: ArweaveNodeType): boolean;

	/**
	 * Clears all cached instances (useful for testing)
	 */
	clearInstances(): void;
}
