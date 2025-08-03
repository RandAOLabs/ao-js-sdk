import { ArweaveGQLResponse } from "./abstract/types";
import { ArweaveDataService } from "./ArweaveDataService";
import { ICache, newCache } from "../../utils/cache";
import { ICacheConfig } from "../../utils/cache/abstract";
import { IAutoconfiguration, staticImplements } from "../../utils";
import { IArweaveDataCachingService } from "./abstract/IArweaveDataCachingService";
import { IHttpClient } from "../../utils/http";
import Arweave from "arweave";
import { ArweaveNodeFactory, ArweaveNodeType } from "./graphql-nodes";
import { getArweaveDotNetHttpClient } from "./http-nodes/arweave-dot-net-http-client";

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataCachingService extends ArweaveDataService implements IArweaveDataCachingService {
	private cache: ICache<string, ArweaveGQLResponse>;

	private constructor(_arweave:Arweave, _httpClient:IHttpClient, cacheConfig?: ICacheConfig) {
		super(_arweave, _httpClient);
		this.cache = newCache<string, ArweaveGQLResponse>(cacheConfig);
	}

	public static autoConfiguration(): IArweaveDataCachingService {
		const _arweave = ArweaveNodeFactory.getInstance().getNodeClient(ArweaveNodeType.GOLDSKY)
		const _httpClient = getArweaveDotNetHttpClient()
		return new ArweaveDataCachingService(_arweave, _httpClient);
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
