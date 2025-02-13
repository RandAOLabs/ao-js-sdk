import { IProfileRegistryClient, ProfileRegistryEntry } from "src/clients/profile-registry/abstract";
import { getProfileRegistryClientAutoConfiguration } from "src/clients/profile-registry/ProfileRegistryClientAutoConfiguration";
import { GetProfilesError } from "src/clients/profile-registry/RegistryClientError";
import { SyncBaseClient } from "src/core/ao/index";
import { Logger } from "src/utils/index";


/**
 * @category Clients
 */
export class ProfileRegistryClient extends SyncBaseClient implements IProfileRegistryClient {
    /* Constructors */
    public static autoConfiguration(): ProfileRegistryClient {
        return new ProfileRegistryClient(getProfileRegistryClientAutoConfiguration());
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
            const data = this.getFirstMessageDataJson<ProfileRegistryEntry[]>(response);
            return data
        } catch (error: any) {
            Logger.error(`Error fetching profiles for wallet address ${walletAddress}: ${error.message}`);
            throw new GetProfilesError(walletAddress ?? 'self', error);
        }
    }
    /* Core Profile Registry Functions */
}