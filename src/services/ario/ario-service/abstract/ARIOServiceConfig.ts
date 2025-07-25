import { ARNSClient } from "../../../../clients";
import { ARNSClientConfig } from "../../../../clients/ario/arns/abstract/ARNSClientConfig";
import { ICacheConfig } from "../../../../utils";

export interface ARIOServiceConfig {
	arnsClient: ARNSClient
	cacheConfig?: ICacheConfig
}
