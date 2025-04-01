import { IProfileRegistryClient, ProfileRegistryEntry } from "./abstract";
import { ClientBuilder } from "../../common";
import { ClientError } from "../../common/ClientError";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { PROCESS_IDS } from "../../../process-ids";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "../../../utils/index";


/**
 * @category Bazar
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProfileRegistryClient extends DryRunCachingClient implements IProfileRegistryClient {
	/* Constructors */

	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): ProfileRegistryClient {
		return ProfileRegistryClient.defaultBuilder()
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
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
