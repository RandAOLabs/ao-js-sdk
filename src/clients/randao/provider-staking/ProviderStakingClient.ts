import { IStakingClient, StakingClient, StakingClientConfig, TokenClient } from "src/clients/ao";
import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";
import { ProviderDetails } from "src/clients/randao/provider-profile";
import { IProviderStakingClient } from "src/clients/randao/provider-staking/abstract/IProviderStakingClient";
import { ProviderStakeInfo } from "src/clients/randao/provider-staking/abstract/types";
import { GetStakeError, ProviderUnstakeError, StakeWithDetailsError } from "src/clients/randao/provider-staking/ProviderStakingError";
import { Tags } from "src/core";
import { SyncAutoConfigBaseClient } from "src/core/ao/client-variants/SyncAutoConfigBaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { RANDAO_PROFILE_PROCESS_ID, RANDAO_STAKING_TOKEN_PROCESS_ID } from "src/processes_ids";
import { Logger } from "src/utils";

/**
 * @category RandAO
 */
export class ProviderStakingClient extends SyncAutoConfigBaseClient implements IProviderStakingClient, IStakingClient {
    // Include StakingClient functionality
    private stakingClient: StakingClient;
    private readonly tokenClient: TokenClient;

    public constructor(config: StakingClientConfig) {
        super(config);
        this.stakingClient = new StakingClient(config);
        this.tokenClient = this.stakingClient.tokenClient;
    }

    public static defaultConfigBuilder(): TokenInterfacingClientConfigBuilder {
        return new TokenInterfacingClientConfigBuilder()
            .withProcessId(RANDAO_PROFILE_PROCESS_ID)
            .withTokenProcessId(RANDAO_STAKING_TOKEN_PROCESS_ID)
    }

    // Delegate StakingClient methods
    public stake(quantity: string, additionaForwardedlTags?: Tags): Promise<boolean> {
        return this.stakingClient.stake(quantity, additionaForwardedlTags);
    }

    public getStakingToken(): TokenClient {
        return this.stakingClient.getStakingToken();
    }

    public async stakeWithDetails(quantity: string, providerDetails?: ProviderDetails): Promise<boolean> {
        try {

            const additionaForwardedlTags = providerDetails
                ? [{
                    name: "ProviderDetails",
                    value: JSON.stringify(providerDetails)
                }]
                : undefined
            const success = await this.stake(quantity, additionaForwardedlTags);
            return success
        } catch (error: any) {
            Logger.error(`Error staking with provider details ${quantity} tokens: ${error.message}`);
            throw new StakeWithDetailsError(error, providerDetails);
        }
    }

    public async getStake(providerId: string): Promise<ProviderStakeInfo> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Provider-Stake" }
            ];
            const requestData = JSON.stringify({ providerId });
            const result = await this.dryrun(requestData, tags);
            const stakeStringJson = ResultUtils.getFirstMessageDataString(result);
            const stake: ProviderStakeInfo = JSON.parse(stakeStringJson)

            return stake;
        } catch (error: any) {
            Logger.error(`Error getting stake for provider ${providerId}: ${error.message}`);
            throw new GetStakeError(providerId, error);
        }
    }

    /** @Override  */
    public async unstake(providerId: string): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Unstake" }
            ];
            const data = JSON.stringify({ providerId })
            const result = await this.unstake(data)
            return result
        } catch (error: any) {
            Logger.error(`Provider Error unstaking for: ${error.message}`);
            throw new ProviderUnstakeError(error);
        }
    }
}
