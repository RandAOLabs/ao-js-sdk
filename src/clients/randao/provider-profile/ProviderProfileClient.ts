import { ClientBuilder } from "../../common";
import { ClientError } from "../../common/ClientError";
import { IProviderProfileClient } from "./abstract/IProviderProfileClient";
import { ProviderDetails, ProviderInfo, ProviderInfoDTO } from "./abstract/types";
import { Tags } from "../../../core";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { PROCESS_IDS } from "../../../process-ids";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "../../../utils";

/**
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProviderProfileClient extends DryRunCachingClient implements IProviderProfileClient {
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): ProviderProfileClient {
		return ProviderProfileClient.defaultBuilder()
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static defaultBuilder(): ClientBuilder<ProviderProfileClient> {
		return new ClientBuilder(ProviderProfileClient)
			.withProcessId(PROCESS_IDS.RANDAO.PROFILE)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
	}

	/* Interface Provider Profile Functions */
	async updateDetails(providerDetails: ProviderDetails): Promise<string> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Update-Provider-Details" }
			];
			const data = JSON.stringify({ providerDetails: JSON.stringify(providerDetails) });
			const result = await this.messageResult(data, tags);
			this.clearCache()
			return ResultUtils.getFirstMessageDataString(result);
		} catch (error: any) {
			throw new ClientError(this, this.updateDetails, { providerDetails }, error);
		}
	}
	async getAllProvidersInfo(): Promise<ProviderInfo[]> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-All-Providers-Details" }
			];
			const result = await this.dryrun("", tags);
			const dtos = ResultUtils.getFirstMessageDataJson<ProviderInfoDTO[]>(result);
			const providers = dtos.map(dto => this._parseProviderInfoDTO(dto));
			return providers;
		} catch (error: any) {
			throw new ClientError(this, this.getAllProvidersInfo, null, error);
		}
	}

	/** 
	 * Known issues with return value on this method TODO fix
	 */
	async getProviderInfo(providerId?: string): Promise<ProviderInfo> {
		let providerWalletAddress;
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-Provider-Details" }
			];
			providerWalletAddress = providerId || await this.getCallingWalletAddress();
			const data = JSON.stringify({ providerId: providerWalletAddress });
			const result = await this.dryrun(data, tags);
			const dto = ResultUtils.getFirstMessageDataJson<ProviderInfoDTO>(result);
			const info = this._parseProviderInfoDTO(dto);
			return info;
		} catch (error: any) {
			throw new ClientError(this, this.getProviderInfo, { providerId }, error);
		}
	}
	/* Interface Provider Profile Functions */

	/* Private Functions */
	private _parseProviderInfoDTO(dto: ProviderInfoDTO): ProviderInfo {
		return {
			...dto,
			provider_details: dto.provider_details ? JSON.parse(dto.provider_details) : undefined,
			stake: JSON.parse(dto.stake)
		};
	}
	/* Private Functions */
}
