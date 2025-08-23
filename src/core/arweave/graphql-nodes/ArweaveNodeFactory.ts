import Arweave from 'arweave';
import { getEnvironment, Environment, UnknownEnvironmentError, Logger } from '../../../utils';
import { ArweaveInitializationError as ArweaveNodeInitializationError } from '../ArweaveDataServiceError';
import { ApiConfig } from 'arweave/node/lib/api';
import { ARWEAVE_GOLDSKY_NODE_CONFIG, ARWEAVE_DOT_NET_NODE_CONFIG, ARIO_DEV_NODE_CONFIG } from './constants';
import { ArweaveNodeType, ArweaveNodeConfig, IArweaveNodeFactory, IArweaveNodeClient } from './abstract';
import { ArweaveNodeClient } from './ArweaveNodeClient';

/**
 * ArweaveNodeFactory manages singleton Arweave instances for different node configurations.
 * Ensures only one Arweave connection exists per configuration type throughout the application lifecycle.
 */
export class ArweaveNodeFactory implements IArweaveNodeFactory {
	/**
	 * Singleton instances of Arweave for each node type.
	 * Each configuration type gets its own singleton instance.
	 */
	private static instances: Map<ArweaveNodeType, Arweave> = new Map();

	/**
	 * Configuration mapping for different node types
	 */
	private static readonly NODE_CONFIGS: Record<ArweaveNodeType, ArweaveNodeConfig> = {
		[ArweaveNodeType.GOLDSKY]: {
			browserConfig: ARWEAVE_GOLDSKY_NODE_CONFIG,
			nodeConfig: ARWEAVE_GOLDSKY_NODE_CONFIG
		},
		[ArweaveNodeType.DOT_NET]: {
			browserConfig: ARWEAVE_DOT_NET_NODE_CONFIG,
			nodeConfig: ARWEAVE_DOT_NET_NODE_CONFIG
		},
		[ArweaveNodeType.ARIO_DEV]: {
			browserConfig: ARIO_DEV_NODE_CONFIG,
			nodeConfig: ARIO_DEV_NODE_CONFIG
		}
	};

	/**
	 * Private constructor to prevent direct instantiation
	 */
	private constructor() { }

	/**
	 * Singleton factory instance
	 */
	private static factoryInstance: ArweaveNodeFactory | null = null;

	/**
	 * Gets the singleton factory instance
	 */
	public static getInstance(): ArweaveNodeFactory {
		if (!ArweaveNodeFactory.factoryInstance) {
			ArweaveNodeFactory.factoryInstance = new ArweaveNodeFactory();
		}
		return ArweaveNodeFactory.factoryInstance;
	}

	/**
	 * Creates or returns wrapped ArweaveNode instance for the specified node type.
	 * This is the main method for getting Arweave functionality.
	 *
	 * @param nodeType The type of Arweave node configuration to use
	 * @returns ArweaveNode wrapper instance configured for the specified node type
	 * @throws ArweaveNodeInitializationError if initialization fails
	 * @throws Error if unsupported node type is provided
	 */
	public getNode(nodeType: ArweaveNodeType): IArweaveNodeClient {
		const arweaveInstance = this.createArweaveInstance(nodeType);
		return new ArweaveNodeClient(arweaveInstance, nodeType);
	}

	/**
	 * Creates or returns existing Arweave instance for the specified node type.
	 * This is a private method used internally by getNode().
	 *
	 * @param nodeType The type of Arweave node configuration to use
	 * @returns Arweave instance configured for the specified node type
	 * @throws ArweaveNodeInitializationError if initialization fails
	 * @throws Error if unsupported node type is provided
	 */
	private createArweaveInstance(nodeType: ArweaveNodeType): Arweave {
		// Return existing instance if it exists
		if (ArweaveNodeFactory.instances.has(nodeType)) {
			return ArweaveNodeFactory.instances.get(nodeType)!;
		}

		// Validate node type
		if (!ArweaveNodeFactory.NODE_CONFIGS[nodeType]) {
			throw new Error(`Unsupported Arweave node type: ${nodeType}`);
		}

		try {
			const environment = getEnvironment();
			const config = ArweaveNodeFactory.NODE_CONFIGS[nodeType];
			let arweaveConfig: ApiConfig;

			switch (environment) {
				case Environment.BROWSER:
					arweaveConfig = config.browserConfig;
					break;
				case Environment.NODE:
					arweaveConfig = config.nodeConfig;
					break;
				default:
					throw new UnknownEnvironmentError();
			}

			Logger.debug(`Creating new Arweave instance for node type: ${nodeType} in ${environment} environment`);
			const instance = Arweave.init(arweaveConfig);

			// Cache the instance
			ArweaveNodeFactory.instances.set(nodeType, instance);

			return instance;
		} catch (error: any) {
			Logger.error(`Error initializing Arweave for node type ${nodeType}: ${error.message}`);
			throw new ArweaveNodeInitializationError(error);
		}
	}

	/**
	 * Checks if a node instance exists for the given type
	 *
	 * @param nodeType The type of Arweave node configuration to check
	 * @returns True if instance exists, false otherwise
	 */
	public hasInstance(nodeType: ArweaveNodeType): boolean {
		return ArweaveNodeFactory.instances.has(nodeType);
	}

	/**
	 * Clears all cached instances.
	 * Useful for testing or when you need to force recreation of instances.
	 */
	public clearInstances(): void {
		Logger.debug('Clearing all Arweave node instances');
		ArweaveNodeFactory.instances.clear();
	}

	/**
	 * Gets all currently cached node types
	 *
	 * @returns Array of node types that have cached instances
	 */
	public getCachedNodeTypes(): ArweaveNodeType[] {
		return Array.from(ArweaveNodeFactory.instances.keys());
	}
}

/**
 * Convenience function to get an ArweaveNode wrapper for a specific node type
 *
 * @param nodeType The type of Arweave node configuration to use
 * @returns ArweaveNode wrapper instance configured for the specified node type
 */
export const getArweaveNode = (nodeType: ArweaveNodeType): IArweaveNodeClient => {
	return ArweaveNodeFactory.getInstance().getNode(nodeType);
};

/**
 * Convenience function to get a GoldSky ArweaveNode wrapper
 *
 * @returns ArweaveNode wrapper instance configured for GoldSky
 */
export const getGoldSkyArweave = (): IArweaveNodeClient => {
	return getArweaveNode(ArweaveNodeType.GOLDSKY);
};

/**
 * Convenience function to get an Arweave.net ArweaveNode wrapper
 *
 * @returns ArweaveNode wrapper instance configured for Arweave.net
 */
export const getDotNetArweave = (): IArweaveNodeClient => {
	return getArweaveNode(ArweaveNodeType.DOT_NET);
};
