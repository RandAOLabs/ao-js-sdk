import { ApiConfig } from "arweave/node/lib/api";
import { HttpClientConfig } from "../../utils/http";

/**
 * Default Arweave connection configuration used across environments
 */
export const ARWEAVE_GOLDSKY_CONFIG: ApiConfig = {
	host: 'arweave-search.goldsky.com',
	port: 443,
	protocol: 'https'
} as const;

export const ARWEAVE_DOT_NET_HTTP_CONFIG: HttpClientConfig = {
	baseURL: "https://arweave.net",
	timeout: 30000
} as const;

export const ARWEAVE_BLOCK_TIMES = {
	2023: {
		APRIL: 1395080,
	},
	2025:{
		APRIL:1640635,
		MAY: 1660951
	}
}