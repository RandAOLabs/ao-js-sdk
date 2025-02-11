import { ProfileClientConfig } from "./abstract/ProfileClientConfig";
import { getBaseClientAutoConfiguration } from "../../../core/ao/BaseClientAutoConfiguration";
import { ProfileRegistryClient } from "../profile-registry/ProfileRegistryClient";
import { NoProfileFoundError } from "./ProfileClientError";

export const getProfileClientAutoConfiguration = async (): Promise<ProfileClientConfig> => {
    const registryClient = ProfileRegistryClient.autoConfiguration();
    const walletAddress = await registryClient.getCallingWalletAddress();
    const profiles = await registryClient.getProfileByWalletAddress();

    if (!profiles || profiles.length === 0) {
        throw new NoProfileFoundError(walletAddress);
    }

    return {
        ...getBaseClientAutoConfiguration(),
        processId: profiles[0].ProfileId
    };
}
