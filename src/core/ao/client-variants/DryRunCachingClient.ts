import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { IDryRunCachingClient } from "src/core/ao/abstract/ICachingClient"
import { BaseClient } from "src/core/ao/BaseClient";
import { DryRunCachingClientConfig } from "src/core/ao/configuration";
import { Tags } from "src/core/common";
import { ICache, newCache } from "src/utils/cache";

/**
 * @category Core
 */
export class DryRunCachingClient extends BaseClient implements IDryRunCachingClient {
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
    /* Private */
}
