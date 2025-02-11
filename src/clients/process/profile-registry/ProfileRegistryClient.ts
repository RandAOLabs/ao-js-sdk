import { BaseClient } from "../../../core/ao/index";
import { Logger } from "../../../utils/index";
import { IProfileRegistryClient } from "./abstract/IProfileRegistryClient";
import { ProfileRegistryEntry } from "./abstract/types";
import { getProfileRegistryClientAutoConfiguration } from "./ProfileRegistryClientAutoConfiguration";
import { GetProfilesError } from "./RegistryClientError";

/** @see {@link https://cookbook_ao.g8way.io/references/profile-registry.html | specification} */
export class ProfileRegistryClient extends BaseClient implements IProfileRegistryClient {
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