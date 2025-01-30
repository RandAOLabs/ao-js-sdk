import { Tags } from '../../core/abstract/types';
import { BaseClient } from '../../core/BaseClient';
import { IStakingClient } from './abstract/IStakingClient';
import { ProviderDetails } from './abstract/types';
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
            const data = JSON.stringify(providerDetails);
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

    async getStake(providerId: string): Promise<any> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Provider-Stake" }
            ];
            const data = JSON.stringify({ providerId });
            const result = await this.dryrun(data, tags);
            return this.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error getting stake for provider ${providerId}: ${error.message}`);
            throw new GetStakeError(providerId, error);
        }
    }

    async unstake(providerId: string): Promise<string> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Unstake" }
            ];
            const data = JSON.stringify({ providerId });
            const result = await this.messageResult(data, tags);
            const response = this.getFirstMessageDataString(result);
            return response;
        } catch (error: any) {
            Logger.error(`Error unstaking for provider ${providerId}: ${error.message}`);
            throw new UnstakeError(providerId, error);
        }
    }
    /* Core Staking Functions */
}
