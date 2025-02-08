import { Tags, BaseClient } from "../../core/ao/index";
import { Logger } from "../../utils/index";
import { IProfileClient } from "./abstract/IProfileClient";
import { ProfileInfo } from "./abstract/types";
import { getProfileClientAutoConfiguration } from "./ProfileClientAutoConfiguration";
import { AsyncInitializationRequiredError, GetProfileError, ProfileTransferError } from "./ProfileClientError";

/** @see {@link https://cookbook_ao.g8way.io/references/profile.html | specification} */
export class ProfileClient extends BaseClient implements IProfileClient {
    /* Constructors */
    public static autoConfiguration(): ProfileClient {
        throw new AsyncInitializationRequiredError();
    }

    public static async createAutoConfigured(): Promise<ProfileClient> {
        const config = await getProfileClientAutoConfiguration();
        return new ProfileClient(config);
    }
    /* Constructors */

    /* Core Profile Functions */
    public async getProfileInfo(address?: string): Promise<ProfileInfo> {
        if (!address) {
            address = await this.getCallingWalletAddress();
        }
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: "Info" },
            ]);
            return this.getFirstMessageDataJson<ProfileInfo>(response);
        } catch (error: any) {
            Logger.error(`Error fetching profile for address ${address}: ${error.message}`);
            throw new GetProfileError(address, error);
        }
    }

    public async transferAsset(assetToTransfer: string, recipient: string, quantity: string, tags?: Tags): Promise<boolean> {
        try {
            const transferTags: Tags = [
                { name: "Action", value: "Transfer" },
                { name: "Target", value: assetToTransfer },
                { name: "Recipient", value: recipient },
                { name: "Quantity", value: quantity }
            ];
            if (tags) {
                tags.forEach(tag => transferTags.push(tag));
            }
            const result = await this.messageResult('', transferTags);
            const actionValue = this.findTagValue(result.Messages[0].Tags, "Action");
            return actionValue !== "Transfer-Failed";
        } catch (error: any) {
            Logger.error(`Error transferring ${quantity} from ${assetToTransfer} to ${recipient}: ${error.message}`);
            throw new ProfileTransferError(assetToTransfer, recipient, quantity, error);
        }
    }
    /* Core Profile Functions */
}
