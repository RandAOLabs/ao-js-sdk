import { ClientBuilder } from "src/clients/common";
import { IProviderProfileClient } from "src/clients/randao/provider-profile/abstract/IProviderProfileClient";
import { ProviderDetails, ProviderInfo, ProviderInfoDTO } from "src/clients/randao/provider-profile/abstract/types";
import { Tags } from "src/core";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { RANDAO_PROFILE_PROCESS_ID } from "src/processes_ids";
import { IAutoconfiguration, IDefaultBuilder, Logger } from "src/utils";

/**
 * @category RandAO
 */

export class ProviderProfileClient extends DryRunCachingClient implements IProviderProfileClient, IAutoconfiguration, IDefaultBuilder {
    public static autoConfiguration(): ProviderProfileClient {
        return ProviderProfileClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<ProviderProfileClient> {
        return new ClientBuilder(ProviderProfileClient)
            .withProcessId(RANDAO_PROFILE_PROCESS_ID)
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
            Logger.error(`Error updating provider details: ${error.message}`);
            throw new Error(`Failed to update provider details: ${error.message}`);
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
            Logger.error(`Error getting all providers info: ${error.message}`);
            throw new Error(`Failed to get all providers info: ${error.message}`);
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
            Logger.error(`Error getting provider info for ${providerWalletAddress}: ${error.message}`);
            throw new Error(`Failed to get provider info for ${providerWalletAddress}: ${error.message}`);
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