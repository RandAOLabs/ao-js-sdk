import { IArweaveGraphQLNodeClient } from './IArweaveGraphQLNodeClient';
import { ArweaveNodeType } from './types';


/**
 * Type definition for the ArweaveNodeFactory
 */
export interface IArweaveGraphQLNodeClientFactory {
	/**
	 * Creates or returns wrapped ArweaveNode instance for the specified node type
	 * @param nodeType The type of Arweave node configuration to use
	 * @returns ArweaveNode wrapper instance configured for the specified node type
	 */
	getNode(nodeType: ArweaveNodeType): IArweaveGraphQLNodeClient;

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
