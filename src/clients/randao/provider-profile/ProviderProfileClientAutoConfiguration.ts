import { BaseClientConfig } from "src/core";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { RANDAO_PROFILE_PROCESS_ID } from "src/processes_ids";

export const getProviderProfileClientAutoConfiguration = (): BaseClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RANDAO_PROFILE_PROCESS_ID,
});
