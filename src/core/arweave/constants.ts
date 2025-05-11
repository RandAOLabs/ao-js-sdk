import { ApiConfig } from "arweave/node/lib/api";

/**
 * Default Arweave connection configuration used across environments
 */
export const ARWEAVE_GOLDSKY_CONFIG: ApiConfig = {
    host: 'arweave-search.goldsky.com',
    port: 443,
    protocol: 'https'
} as const;

export const ARWEAVE_DOT_NET_CONFIG : ApiConfig = {
    host: 'mxcfsjttnm7iqetifkrewsl7kxgqz3pk3bh5zrbqy3vkbr24vnka.arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
} as const;