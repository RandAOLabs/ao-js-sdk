import { ArweaveGQLBuilder } from "src/core/arweave/gql/ArweaveGQLBuilder";
import { ArweaveGQLResponse, ArweaveTransaction } from "src/core/arweave/abstract/types";
import { BaseArweaveDataService } from "./ArweaveDataService";
import { ICache, newCache } from "src/utils/cache";
import { ICacheConfig } from "src/utils/cache/abstract";

/**
 * @category Core
 */
export class ArweaveDataCachingService extends BaseArweaveDataService {
    private cache: ICache<string, ArweaveGQLResponse>;

    constructor(cacheConfig?: ICacheConfig) {
        super();
        this.cache = newCache<string, ArweaveGQLResponse>(cacheConfig);
    }

    public clearCache(): void {
        this.cache.clear();
    }

    /** @override */
    public async graphQuery<T = any>(query: string): Promise<T> {
        const cacheKey = this.createCacheKey(query);
        const cachedResult = this.cache.get(cacheKey);

        if (cachedResult) {
            return cachedResult as T;
        }

        const result = await super.graphQuery<T>(query);
        this.cache.set(cacheKey, result as ArweaveGQLResponse);
        return result;
    }

    /* Private */
    private createCacheKey(query: string): string {
        return JSON.stringify({ query });
    }
    /* Private */
}
