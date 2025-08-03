import { ApiConfig } from "arweave/node/lib/api";

/**
 * Default Arweave connection configuration used across environments
 */
export const ARWEAVE_GOLDSKY_NODE_CONFIG: ApiConfig = {
	host: 'arweave-search.goldsky.com',
	port: 443,
	protocol: 'https'
} as const;


export const ARWEAVE_DOT_NET_NODE_CONFIG: ApiConfig = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
} as const;