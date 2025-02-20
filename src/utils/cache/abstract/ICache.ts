import { ICacheConfig } from 'src/utils/cache/abstract/ICacheConfig';

/**
 * Generic interface for cache implementations.
 * Provides standard cache operations with type-safe key-value pairs.
 * @category Utility
 * @typeParam K - The type of keys used in the cache. Defaults to string.
 * @typeParam V - The type of values stored in the cache. Defaults to any.
 */
export interface ICache<K extends {} = string, V extends {} = any> {
    /**
     * Retrieves a value from the cache by its key.
     * @param key The key to look up
     * @returns The cached value if found, undefined otherwise
     */
    get(key: K): V | undefined;

    /**
     * Stores a value in the cache with the specified key.
     * If the key already exists, its value will be updated.
     * @param key The key to store the value under
     * @param value The value to cache
     */
    set(key: K, value: V): void;

    /**
     * Removes an entry from the cache by its key.
     * If the key doesn't exist, this operation has no effect.
     * @param key The key to remove from the cache
     */
    delete(key: K): void;

    /**
     * Removes all entries from the cache.
     * Resets the cache to its initial empty state.
     */
    clear(): void;

    /**
     * Checks if a key exists in the cache.
     * @param key The key to check for
     * @returns true if the key exists in the cache, false otherwise
     */
    has(key: K): boolean;
}
