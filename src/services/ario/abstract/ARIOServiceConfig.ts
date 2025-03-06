import { ARNSClientConfig } from "src/clients/ario/arns/abstract/ARNSClientConfig";
import { ICacheConfig } from "src/utils";

export interface ARIOServiceConfig {
    arnsClientConfig: ARNSClientConfig
    cacheConfig?: ICacheConfig
}