import { ARNSClient } from "src/clients";
import { ARNSClientConfig } from "src/clients/ario/arns/abstract/ARNSClientConfig";
import { ICacheConfig } from "src/utils";

export interface ARIOServiceConfig {
    arnsClient: ARNSClient
    cacheConfig?: ICacheConfig
}