import { IProfileRegistryClient, ProfileRegistryEntry } from "src/clients/bazar/profile-registry/abstract";
import { GetProfilesError } from "src/clients/bazar/profile-registry/RegistryClientError";
import { DryRunCachingClientConfigBuilder } from "src/core";
import { SyncAutoConfigBaseClient } from "src/core/ao/client-variants/SyncAutoConfigBaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { PROFILE_REGISTRY_PROCESS_ID } from "src/processes_ids";
import { Logger } from "src/utils/index";


/**
 * @category Bazar
 */
export class ProfileRegistryClient extends SyncAutoConfigBaseClient implements IProfileRegistryClient {
    /* Constructors */

    public static defaultConfigBuilder(): DryRunCachingClientConfigBuilder {
        return new DryRunCachingClientConfigBuilder()
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