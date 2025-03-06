import { BaseClientConfig } from "src/core";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { RANDAO_PROFILE_PROCESS_ID } from "src/processes_ids";

export const getProviderProfileClientAutoConfiguration = (): BaseClientConfig => {
    const builder = new BaseClientConfigBuilder()
    return builder
        .withProcessId(RANDAO_PROFILE_PROCESS_ID)
        .build()
}