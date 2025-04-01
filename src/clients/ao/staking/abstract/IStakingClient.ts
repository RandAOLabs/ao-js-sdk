import { Tags } from "../../../../core";

export interface IStakingClient {
    /**
     * Stakes tokens by transferring them with an X-Stake tag
     * @param quantity Amount of tokens to stake
     * @returns Promise resolving to the boolean representation of staking success
     */
    stake(quantity: string, additionaForwardedlTags?: Tags): Promise<boolean>;

    /**
     * Unstakes tokens for a provider
     * @param data optional data to pass when unstaking
     * @returns Promise resolving to true if unstaking was successful, false if it failed
     */
    unstake(data: string): Promise<boolean>;
}
