import { IProfileRegistryClient, ProfileRegistryEntry } from "src/clients/bazar/profile-registry/abstract";
import { ClientBuilder } from "src/clients/common";
import { ClientError } from "src/clients/common/ClientError";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { PROCESS_IDS } from "src/process-ids";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "src/utils/index";


/**
 * @category Bazar
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProfileRegistryClient extends DryRunCachingClient implements IProfileRegistryClient {
    /* Constructors */

    public static autoConfiguration(): ProfileRegistryClient {
        return ProfileRegistryClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<ProfileRegistryClient> {
        return new ClientBuilder(ProfileRegistryClient)
            .withProcessId(PROCESS_IDS.BAZAR.PROFILE_REGISTRY)
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
            throw new ClientError(this, this.getProfileByWalletAddress, { walletAddress }, error);
        }
    }
    /* Core Profile Registry Functions */
}