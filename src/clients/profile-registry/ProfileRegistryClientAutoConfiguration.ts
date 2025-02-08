import { ProfileRegistryClientConfig } from "./abstract/ProfileRegistryClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/ao/BaseClientAutoConfiguration";
import { PROFILE_REGISTRY_PROCESS_ID } from "../../processes_ids";

export const getProfileRegistryClientAutoConfiguration = (): ProfileRegistryClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: PROFILE_REGISTRY_PROCESS_ID,
});
