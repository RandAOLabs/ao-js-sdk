import { ProfileRegistryClientConfig } from "src/clients/bazar/profile-registry/abstract";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { PROFILE_REGISTRY_PROCESS_ID } from "src/processes_ids";

/**
 * 
 * @deprecated 
 */
export const getProfileRegistryClientAutoConfiguration = (): ProfileRegistryClientConfig => {
    const builder = new BaseClientConfigBuilder()
    return builder
        .build()
}