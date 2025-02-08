import { Tags } from '../../core/ao/abstract/types';
import { BaseClient } from '../../core/ao/BaseClient';
import { IStakingClient } from './abstract/IStakingClient';
import { ProviderDetails, ProviderInfo, ProviderInfoDTO, StakeInfo } from './abstract/types';
import { Logger } from '../../utils/logger/logger';
import { StakeError, GetStakeError, UnstakeError } from './StakingClientError';
import { getStakingClientAutoConfiguration } from './StakingClientAutoConfiguration';
import { StakingClientConfig } from './abstract/StakingClientConfig';
import { TokenClient } from '../token';
import { TokenClientConfig } from '../token/abstract/TokenClientConfig';

/** @see {@link https://cookbook_ao.g8way.io/references/staking.html | specification} */
export class StakingClient extends BaseClient implements IStakingClient {
    /* Fields */
    readonly tokenClient: TokenClient;
    /* Fields */

    /* Constructors */
    public constructor(stakingConfig: StakingClientConfig) {
        super(stakingConfig);
        const tokenConfig: TokenClientConfig = {
            processId: stakingConfig.tokenProcessId,
            wallet: stakingConfig.wallet,
            environment: stakingConfig.environment
        };
        this.tokenClient = new TokenClient(tokenConfig);
    }

    public static autoConfiguration(): StakingClient {
        return new StakingClient(getStakingClientAutoConfiguration());
    }
    /* Constructors */

    /* Getters */
    public getStakingToken(): TokenClient {
        return this.tokenClient;
    }
    /* Getters */

    /* Core Staking Functions */
    async updateDetails(providerDetails: ProviderDetails): Promise<string> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Update-Provider-Details" }
            ];
            const data = JSON.stringify({ providerDetails: JSON.stringify(providerDetails) });
            const result = await this.messageResult(data, tags);
            return this.getFirstMessageDataString(result);
        } catch (error: any) {
            Logger.error(`Error updating provider details: ${error.message}`);
            throw new Error(`Failed to update provider details: ${error.message}`);
        }
    }

    async stake(quantity: string, providerDetails?: ProviderDetails): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Stake", value: "true" }
            ];

            if (providerDetails) {
                tags.push({ name: "ProviderDetails", value: JSON.stringify(providerDetails) });
            }

            const success = await this.tokenClient.transfer(this.getProcessId(), quantity, tags);
            if (!success) {
                throw new Error("Token transfer failed");
            }

            return true;
        } catch (error: any) {
            Logger.error(`Error staking ${quantity} tokens: ${error.message}`);
            throw new StakeError(quantity, error);
        }
    }

    async getStake(providerId: string): Promise<StakeInfo> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Provider-Stake" }
            ];
            const requestData = JSON.stringify({ providerId });
            const result = await this.dryrun(requestData, tags);
            const stake = this.getFirstMessageDataJson<StakeInfo>(result);
            return stake;
        } catch (error: any) {
            Logger.error(`Error getting stake for provider ${providerId}: ${error.message}`);
            throw new GetStakeError(providerId, error);
        }
    }

    /**
     * Unstakes tokens for a given provider
     * @param providerId The ID of the provider to unstake from
     * @returns true if unstaking was successful, false if it failed
     */
    async unstake(providerId: string): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Unstake" }
            ];
            const data = JSON.stringify({ providerId });
            const result = await this.messageResult(data, tags);
            const response = this.getFirstMessageDataString(result);
            if (!response) {
                return false
            }
            return !response.includes("Failed to unstake");
        } catch (error: any) {
            Logger.error(`Error unstaking for provider ${providerId}: ${error.message}`);
            throw new UnstakeError(providerId, error);
        }
    }

    async getAllProvidersInfo(): Promise<ProviderInfo[]> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-All-Providers-Details" }
            ];
            const result = await this.dryrun("", tags);
            const dtos = this.getFirstMessageDataJson<ProviderInfoDTO[]>(result);
            const providers = dtos.map(dto => this.parseProviderInfoDTO(dto));
            return providers;
        } catch (error: any) {
            Logger.error(`Error getting all providers info: ${error.message}`);
            throw new Error(`Failed to get all providers info: ${error.message}`);
        }
    }

    async getProviderInfo(providerId?: string): Promise<ProviderInfo> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Provider-Details" }
            ];
            const targetId = providerId || await this.getCallingWalletAddress();
            const data = JSON.stringify({ providerId: targetId });
            const result = await this.dryrun(data, tags);
            const dto = this.getFirstMessageDataJson<ProviderInfoDTO>(result);
            const info = this.parseProviderInfoDTO(dto);
            return info;
        } catch (error: any) {
            Logger.error(`Error getting provider info for ${providerId}: ${error.message}`);
            throw new Error(`Failed to get provider info for ${providerId}: ${error.message}`);
        }
    }
    /* Core Staking Functions */

    /* Private Functions */
    private parseProviderInfoDTO(dto: ProviderInfoDTO): ProviderInfo {
        return {
            ...dto,
            active_challenge_requests: dto.active_challenge_requests ? JSON.parse(dto.active_challenge_requests) : undefined,
            active_output_requests: dto.active_output_requests ? JSON.parse(dto.active_output_requests) : undefined,
            provider_details: dto.provider_details ? JSON.parse(dto.provider_details) : undefined,
            stake: JSON.parse(dto.stake)
        };
    }
}
