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
