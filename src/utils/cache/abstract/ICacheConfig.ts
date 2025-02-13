/**
 * Configuration interface for cache implementations.
 * Defines optional parameters to control cache behavior.
 */
export interface ICacheConfig {
    /**
     * Maximum number of entries the cache can hold.
     * When exceeded, least recently used entries will be evicted.
     */
    maxSize?: number;

    /**
     * Maximum age (in milliseconds) that entries can remain in the cache.
     * Entries older than this will be automatically removed.
     */
    maxAge?: number;
}
