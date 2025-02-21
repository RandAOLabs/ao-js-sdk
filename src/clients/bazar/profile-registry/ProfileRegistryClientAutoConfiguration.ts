import { ProfileRegistryClientConfig } from "src/clients/bazar/profile-registry/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { PROFILE_REGISTRY_PROCESS_ID } from "src/processes_ids";

export const getProfileRegistryClientAutoConfiguration = (): ProfileRegistryClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: PROFILE_REGISTRY_PROCESS_ID,
});
