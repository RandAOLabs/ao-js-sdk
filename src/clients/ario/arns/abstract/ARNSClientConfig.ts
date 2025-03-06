import { DryRunCachingClientConfig } from "src/core/ao/configuration";

/**
 * Configuration for the ARNS client
 * @extends DryRunCachingClientConfig
 */
export interface ARNSClientConfig extends DryRunCachingClientConfig {
    /**
     * The process ID for the ARNS service
     */
    processId: string;
}
