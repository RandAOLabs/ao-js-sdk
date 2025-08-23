import { ArweaveGQLResponse } from "./abstract/types";
import { ArweaveDataService } from "./ArweaveDataService";
import { ICache, newCache } from "../../utils/cache";
import { ICacheConfig } from "../../utils/cache/abstract";
import { IAutoconfiguration, staticImplements } from "../../utils";
import { IArweaveDataCachingService } from "./abstract/IArweaveDataCachingService";
import { IHttpClient } from "../../utils/http";
import { ArweaveNodeFactory, ArweaveNodeType, IArweaveNodeClient } from "./graphql-nodes";
import { getArweaveDotNetHttpClient } from "./http-nodes/arweave-dot-net-http-client";

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataCachingService extends ArweaveDataService implements IArweaveDataCachingService {
	private cache: ICache<string, ArweaveGQLResponse>;

	private constructor(_arweaveNode: IArweaveNodeClient, _httpClient: IHttpClient, cacheConfig?: ICacheConfig) {
		super(_arweaveNode, _httpClient);
		this.cache = newCache<string, ArweaveGQLResponse>(cacheConfig);
	}

	public static autoConfiguration(): IArweaveDataCachingService {
		const _arweaveNode = ArweaveNodeFactory.getInstance().getNode(ArweaveNodeType.GOLDSKY)
		const _httpClient = getArweaveDotNetHttpClient()
		return new ArweaveDataCachingService(_arweaveNode, _httpClient);
	}

	public clearCache(): void {
		this.cache.clear();
	}

	/** @override */
	public async graphQuery(query: string): Promise<ArweaveGQLResponse> {
		const cacheKey = this.createCacheKey(query);
		const cachedResult = this.cache.get(cacheKey);

		if (cachedResult) {
			return cachedResult as ArweaveGQLResponse;
		}

		const result = await super.graphQuery(query);
		this.cache.set(cacheKey, result as ArweaveGQLResponse);
		return result;
	}

	/* Private */
	private createCacheKey(query: string): string {
		return JSON.stringify({ query });
	}
	/* Private */
}
