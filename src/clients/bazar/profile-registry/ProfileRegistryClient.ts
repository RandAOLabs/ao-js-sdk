import { IProfileRegistryClient, ProfileRegistryEntry } from "src/clients/bazar/profile-registry/abstract";
import { getProfileRegistryClientAutoConfiguration } from "src/clients/bazar/profile-registry/ProfileRegistryClientAutoConfiguration";
import { GetProfilesError } from "src/clients/bazar/profile-registry/RegistryClientError";
import { ClientBuilder } from "src/clients/common";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { PROFILE_REGISTRY_PROCESS_ID } from "src/processes_ids";
import { IAutoconfiguration, IDefaultBuilder, Logger } from "src/utils/index";


/**
 * @category Bazar
 */
export class ProfileRegistryClient extends DryRunCachingClient implements IProfileRegistryClient, IAutoconfiguration, IDefaultBuilder {
    /* Constructors */

    public static autoConfiguration(): ProfileRegistryClient {
        return ProfileRegistryClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<ProfileRegistryClient> {
        return new ClientBuilder(ProfileRegistryClient)
            .withProcessId(PROFILE_REGISTRY_PROCESS_ID)
    }
    /* Constructors */

    /* Core Profile Registry Functions */
    public async getProfileByWalletAddress(walletAddress?: string): Promise<ProfileRegistryEntry[]> {
        try {
            if (!walletAddress) {
                walletAddress = await this.getCallingWalletAddress();
            }
            const response = await this.dryrun(
                JSON.stringify({ Address: walletAddress }),
                [{ name: "Action", value: "Get-Profiles-By-Delegate" }]
            );
            const data = ResultUtils.getFirstMessageDataJson<ProfileRegistryEntry[]>(response);
            return data
        } catch (error: any) {
            Logger.error(`Error fetching profiles for wallet address ${walletAddress}: ${error.message}`);
            throw new GetProfilesError(walletAddress ?? 'self', error);
        }
    }
    /* Core Profile Registry Functions */
}