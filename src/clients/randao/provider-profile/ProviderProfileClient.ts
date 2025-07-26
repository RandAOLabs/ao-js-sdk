import { ClientBuilder } from "../../common";
import { ClientError } from "../../common/ClientError";
import { IProviderProfileClient } from "./abstract/IProviderProfileClient";
import { ProviderDetails, ProviderInfo, ProviderInfoDTO } from "./abstract/types";
import { ProviderStakeInfo } from "../provider-staking/abstract/types";
import { Tags } from "../../../core";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { PROCESS_IDS } from "../../../processes/ids";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "../../../utils";

/**
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProviderProfileClient extends DryRunCachingClient implements IProviderProfileClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): ProviderProfileClient {
		return ProviderProfileClient.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
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

			try {
				const dtos = ResultUtils.getFirstMessageDataJson<ProviderInfoDTO[]>(result);
				// Filter out any invalid entries that might cause issues
				const validDtos = Array.isArray(dtos) ? dtos.filter(dto => dto !== null && dto !== undefined) : [];
				const providers = validDtos.map(dto => this._parseProviderInfoDTO(dto));
				return providers;
			} catch (parseError: unknown) {
				const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
				Logger.error(`Error parsing provider info: ${errorMessage}`);
				return []; // Return empty array instead of throwing
			}
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
		try {
			// Parse stake data - this is required for a valid ProviderInfo
			const parsedStake = this._safeJsonParse<ProviderStakeInfo>(dto.stake);
			if (!parsedStake) {
				// If we can't parse stake, create a default empty stake object
				Logger.warn(`Invalid stake data for provider ${dto.provider_id}, using empty stake object`);
				const defaultStake: ProviderStakeInfo = {
					timestamp: 0,
					status: "unknown",
					amount: "0",
					token: "",
					provider_id: dto.provider_id
				};
				return {
					...dto,
					provider_details: this._safeJsonParse<ProviderDetails>(dto.provider_details),
					stake: defaultStake
				};
			}

			return {
				...dto,
				provider_details: this._safeJsonParse<ProviderDetails>(dto.provider_details),
				stake: parsedStake
			};
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.warn(`Error parsing provider info DTO: ${errorMessage}`);
			// Return a valid object with default values instead of null
			return {
				...dto,
				provider_details: undefined,
				stake: {
					timestamp: 0,
					status: "error",
					amount: "0",
					token: "",
					provider_id: dto.provider_id
				}
			}
		}
	}

	/**
	 * Safely parse JSON string or return undefined if parsing fails
	 * @param jsonString - The JSON string to parse
	 * @returns Parsed object or undefined
	 */
	private _safeJsonParse<T>(jsonString: string | undefined): T | undefined {
		if (!jsonString) return undefined;

		try {
			return JSON.parse(jsonString) as T;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.warn(`Failed to parse JSON: ${errorMessage}`);
			return undefined;
		}
	}
	/* Private Functions */
}
