import { ApiConfig } from 'arweave/node/lib/api';

/**
 * Configuration mapping for different node types
 */
export interface ArweaveNodeConfig {
	browserConfig: ApiConfig;
	nodeConfig: ApiConfig;
}
