import { ICacheConfig } from './ICacheConfig';

export interface ICache<K extends {} = string, V extends {} = any> {
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    delete(key: K): void;
    clear(): void;
    has(key: K): boolean;
}
