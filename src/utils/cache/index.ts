import { ICache, ICacheConfig } from "./abstract";
import { LRUCacheWrapper } from "./LRUCacheWrapper";


export { ICache, ICacheConfig };
/**
 * @category Utility
 */
export function newCache<K extends {} = string, V extends {} = any>(config?: ICacheConfig): ICache<K, V> {
    return new LRUCacheWrapper<K, V>(config);
}
