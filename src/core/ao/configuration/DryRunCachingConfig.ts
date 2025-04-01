import { BaseClientConfig } from "./BaseClientConfig"
import { ICacheConfig } from "../../../utils"

export interface DryRunCachingClientConfig extends BaseClientConfig {
    cacheConfig?: ICacheConfig
}
