import { BaseClientConfig } from "src/core/ao/abstract/BaseClientConfig"
import { ICacheConfig } from "src/utils"

export interface DryRunCachingClientConfig extends BaseClientConfig {
    cacheConfig?: ICacheConfig
}
