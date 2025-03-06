import { ProfileRegistryClient } from "src/clients/bazar/profile-registry";
import { ProfileClientConfig } from "src/clients/bazar/profile/abstract";
import { NoProfileFoundError } from "src/clients/bazar/profile/ProfileClientError";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";



export const getProfileClientAutoConfiguration = async (): Promise<ProfileClientConfig> => {
    const registryClient = ProfileRegistryClient.autoConfiguration();
    const walletAddress = await registryClient.getCallingWalletAddress();
    const profiles = await registryClient.getProfileByWalletAddress();

    if (!profiles || profiles.length === 0) {
        throw new NoProfileFoundError(walletAddress);
    }

    const builder = new BaseClientConfigBuilder()
    return builder
        .withProcessId(profiles[0].ProfileId)
        .build()
}
