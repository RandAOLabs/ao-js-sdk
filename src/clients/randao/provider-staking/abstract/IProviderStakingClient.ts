import { IStakingClient } from "../../..";
import { ProviderDetails } from "../../provider-profile";
import { Tags } from "../../../../core";
import { UpdateProviderActorData } from "../ProviderStakingClient";

export interface IProviderStakingClient extends IStakingClient {
    /**
     * Stakes tokens by transferring them with an X-Stake tag
     * @param quantity Amount of tokens to stake
     * @param additionaForwardedlTags Additional tags to forward with the stake
     * @param actorId Optional actor ID to authorize for the provider
     * @returns Promise resolving to the boolean representation of staking success
     */
    stake(quantity: string, additionaForwardedlTags?: Tags, actorId?: string): Promise<boolean>;

    /**
     * Stakes tokens by transferring them with an X-Stake tag and provider details
     * @param quantity Amount of tokens to stake
     * @param providerDetails Optional provider details to include
     * @param actorId Optional actor ID to authorize for the provider
     * @returns Promise resolving to the boolean representation of staking success
     */
    stakeWithDetails(quantity: string, providerDetails?: ProviderDetails, actorId?: string): Promise<boolean>;

    /**
     * Gets the current stake for a provider
     * @param providerId The ID of the provider to check stake for
     * @returns Promise resolving to the stake information
     */
    getStake(providerId: string): Promise<any>;

    /**
     * Updates the provider actor for a staker
     * @param providerId The ID of the provider
     * @param actorId The ID of the actor being authorized
     * @returns Promise resolving to a boolean indicating success
     */
    updateProviderActor(providerId: string, actorId: string): Promise<boolean>;
}
