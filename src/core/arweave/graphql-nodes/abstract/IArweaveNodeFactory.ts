import Arweave from 'arweave';

/**
 * Supported Arweave node configuration types
 */
export enum ArweaveNodeType {
	GOLDSKY = 'goldsky',
	DOT_NET = 'dotnet'
}

/**
 * Type definition for the ArweaveNodeFactory
 */
export interface IArweaveNodeFactory {
	/**
	 * Creates or returns existing Arweave instance for the specified node type
	 * @param nodeType The type of Arweave node configuration to use
	 * @returns Arweave instance configured for the specified node type
	 */
	getNodeClient(nodeType: ArweaveNodeType): Arweave;
	
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
