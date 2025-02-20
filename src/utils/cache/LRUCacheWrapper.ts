import { LRUCache } from 'lru-cache';
import { ICache } from 'src/utils/cache/abstract/ICache';
import { ICacheConfig } from 'src/utils/cache/abstract/ICacheConfig';


export class LRUCacheWrapper<K extends {} = string, V extends {} = any> implements ICache<K, V> {
    protected cache: LRUCache<K, V>;

    constructor(config: ICacheConfig = {}) {
        const { maxSize = 1000, maxAge = 5 * 60 * 1000 } = config;
        this.cache = new LRUCache<K, V>({
            max: maxSize,
            ttl: maxAge
        });
    }

    get(key: K): V | undefined {
        return this.cache.get(key);
    }

    set(key: K, value: V): void {
        this.cache.set(key, value);
    }

    delete(key: K): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }
}
