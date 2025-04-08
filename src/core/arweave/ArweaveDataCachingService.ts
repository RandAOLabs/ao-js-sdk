import { ArweaveGQLResponse } from "./abstract/types";
import { ArweaveDataService } from "./ArweaveDataService";
import { ICache, newCache } from "../../utils/cache";
import { ICacheConfig } from "../../utils/cache/abstract";
import { IAutoconfiguration, staticImplements } from "../../utils";
import { IArweaveDataService } from "./abstract";
import { IArweaveDataCachingService } from "./abstract/IArweaveDataCachingService";

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataCachingService extends ArweaveDataService implements IArweaveDataCachingService {
	private cache: ICache<string, ArweaveGQLResponse>;

	private constructor(cacheConfig?: ICacheConfig) {
		super();
		this.cache = newCache<string, ArweaveGQLResponse>(cacheConfig);
	}

	public static autoConfiguration(): IArweaveDataCachingService {
		return new ArweaveDataCachingService()
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
