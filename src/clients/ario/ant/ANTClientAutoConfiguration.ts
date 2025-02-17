import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { ANTClientConfig } from "./types";
import { ANT_PROCESS_ID } from "src/processes_ids";

/**
 * Gets the default configuration for the ANT client
 * @returns ANTClientConfig with default settings
 */
export const getANTClientAutoConfiguration = (): ANTClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: ANT_PROCESS_ID,
});
