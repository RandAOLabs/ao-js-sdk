import { ICache, ICacheConfig } from "src/utils/cache/abstract";
import { LRUCacheWrapper } from "src/utils/cache/LRUCacheWrapper";


export { ICache, ICacheConfig };
/**
 * @category Utility
 */
export function newCache<K extends {} = string, V extends {} = any>(config?: ICacheConfig): ICache<K, V> {
    return new LRUCacheWrapper<K, V>(config);
}
