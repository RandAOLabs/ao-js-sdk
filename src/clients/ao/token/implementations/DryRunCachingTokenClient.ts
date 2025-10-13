import { Tags } from "../../../../core";
import { DryRunResult } from "../../../../core/ao/abstract";
import { DryRunCachingClientConfig } from "../../../../core/ao/configuration/DryRunCachingConfig";
import { Logger } from "../../../../utils";
import { newCache } from "../../../../utils/cache";
import { ICache } from "../../../../utils/cache/abstract";
import { ICaching } from "../../../../utils/class-interfaces";
import { ITokenClient } from "../abstract/ITokenClient";
import { TokenClient } from "./TokenClient";



export class DryRunCachingTokenClient extends TokenClient implements ICaching, ITokenClient {
	private cache: ICache<string, DryRunResult>;

	public constructor(config: DryRunCachingClientConfig) {
		super(config)
		this.cache = newCache<string, DryRunResult>(config.cacheConfig);
	}

	public clearCache(): void {
		this.cache.clear();
	}

	/** @override */
	protected async _dryrun(data: any = '', tags: Tags = [], anchor?: string, id?: string, owner?: string): Promise<DryRunResult> {
		const cacheKey = this.createCacheKey(data, tags, anchor, id, owner);
		const cachedResult = this.cache.get(cacheKey);

		if (cachedResult) {
			Logger.debug(`Using Cached DryRun for ${cacheKey}`) // Leave this debug log in as its useful
			return cachedResult;
		}

		const result = await super._dryrun(data, tags, anchor, id, owner);
		this.cache.set(cacheKey, result);
		return result;
	}

	/* Private */
	private createCacheKey(data: any, tags: Tags, anchor?: string, id?: string, owner?: string): string {
		return JSON.stringify({
			processId: this.getProcessId(),
			data,
			tags,
			anchor,
			id,
			owner
		});
	}
}
