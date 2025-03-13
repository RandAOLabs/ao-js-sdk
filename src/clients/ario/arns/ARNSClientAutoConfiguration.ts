import { ARNSClientConfig } from "src/clients/ario/arns/abstract/ARNSClientConfig";
import { AO_CONFIGURATIONS, ARDRIVE_AO_CONFIG } from "src/core/ao/ao-client/configurations";
import { DryRunCachingClientConfigBuilder } from "src/core/ao/configuration/builder";
import { ARNS_REGISTRY_PROCESS_ID } from "src/processes_ids";

/**
 * Gets the default configuration for the ARNS client
 * @returns ARNSClientConfig with default settings
 */
export const getARNSClientAutoConfiguration = (): ARNSClientConfig => {
    const builder = new DryRunCachingClientConfigBuilder()
    return builder
        .withProcessId(ARNS_REGISTRY_PROCESS_ID)
        .withAOConfig(AO_CONFIGURATIONS.ARDRIVE)
        .build()
}