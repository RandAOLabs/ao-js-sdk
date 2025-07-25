import { ARNSClient } from "../../../../clients";
import { ICacheConfig } from "../../../../utils";

export interface ARIOServiceConfig {
	arnsClient: ARNSClient
	cacheConfig?: ICacheConfig
}
