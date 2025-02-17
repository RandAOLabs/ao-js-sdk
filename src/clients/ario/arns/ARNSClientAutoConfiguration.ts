import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { ARNSClientConfig } from "src/clients/ario/arns/abstract/types";
import { ARNS_REGISTRY_PROCESS_ID } from "src/processes_ids";

/**
 * Gets the default configuration for the ARNS client
 * @returns ARNSClientConfig with default settings
 */
export const getARNSClientAutoConfiguration = (): ARNSClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: ARNS_REGISTRY_PROCESS_ID,
});
