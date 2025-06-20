import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { BaseClient } from "../BaseClient";
import { DryRunCachingClientConfig } from "../configuration";
import { Tags } from "../../common";
import { Logger } from "../../../utils";
import { ICache, newCache } from "../../../utils/cache";
import { ICaching } from "../../../utils/class-interfaces/ICaching";
import { IProcessClient } from "../abstract";

/**
 * @category Core
 */
export class DryRunCachingClient extends BaseClient implements ICaching, IProcessClient {
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
    /* Private */
}
