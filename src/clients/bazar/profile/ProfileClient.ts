
import { IProfileClient, ProfileInfo } from "./abstract";
import { Tags, TagUtils } from "../../../core";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "../../../utils/index";
import { ProfileRegistryClient } from "../profile-registry";
import { ClientBuilder } from "../../common";
import { NoProfileFoundError } from "./ProfileClientError";
import { ClientError } from "../../common/ClientError";

/**
 * @category Bazar
 * @see {@link https://cookbook_ao.g8way.io/references/profile.html | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProfileClient extends DryRunCachingClient implements IProfileClient {
	/* Constructors */
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static async autoConfiguration(): Promise<ProfileClient> {
		const builder = await ProfileClient.defaultBuilder()
		return builder
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static async defaultBuilder(): Promise<ClientBuilder<ProfileClient>> {
		const registryClient = ProfileRegistryClient.autoConfiguration();
		const profiles = await registryClient.getProfileByWalletAddress();

		if (!profiles || profiles.length === 0) {
			const walletAddress = await registryClient.getCallingWalletAddress();
			throw new NoProfileFoundError(walletAddress);
		}

		return new ClientBuilder(ProfileClient)
			.withProcessId(profiles[0].ProfileId)
	}
	/* Constructors */

	/* Core Profile Functions */
	public async getProfileInfo(): Promise<ProfileInfo> {
		const address = await this.getCallingWalletAddress();

		try {
			const response = await this.dryrun('', [
				{ name: "Action", value: "Info" },
			]);
			return ResultUtils.getFirstMessageDataJson<ProfileInfo>(response);
		} catch (error: any) {
			throw new ClientError(this, this.getProfileInfo, null, error);
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
			const actionValue = TagUtils.getTagValue(result.Messages[0].Tags, "Action");
			return actionValue !== "Transfer-Failed";
		} catch (error: any) {
			throw new ClientError(this, this.transferAsset, { assetToTransfer, recipient, quantity, tags }, error);
		}
	}
	/* Core Profile Functions */
}
