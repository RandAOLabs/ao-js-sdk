import { ProfileRegistryClient } from "src/clients/profile-registry";
import { ProfileClientConfig } from "src/clients/profile/abstract";
import { NoProfileFoundError } from "src/clients/profile/ProfileClientError";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { getDryRunCachineClientAutoConfiguration } from "src/core/ao/client-variants";
import { ICacheConfig } from "src/utils";


export const getProfileClientAutoConfiguration = async (): Promise<ProfileClientConfig> => {
    const registryClient = ProfileRegistryClient.autoConfiguration();
    const walletAddress = await registryClient.getCallingWalletAddress();
    const profiles = await registryClient.getProfileByWalletAddress();

    if (!profiles || profiles.length === 0) {
        throw new NoProfileFoundError(walletAddress);
    }

    const config: ProfileClientConfig = {
        ...getBaseClientAutoConfiguration(),
        processId: profiles[0].ProfileId,
    }

    return config
}
