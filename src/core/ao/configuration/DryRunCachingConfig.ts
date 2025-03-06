import { BaseClientConfig } from "src/core/ao/configuration/BaseClientConfig"
import { ICacheConfig } from "src/utils"

export interface DryRunCachingClientConfig extends BaseClientConfig {
    cacheConfig?: ICacheConfig
}
