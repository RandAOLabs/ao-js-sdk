import { CommitParams, RevealParams } from "./params";
import { GetProviderAvailableValuesResponse, GetOpenRandomRequestsResponse, GetRandomRequestsResponse, ProviderActivity, GetUserInfoResponse, MonitoringData } from "./types";

// src/interfaces/IRandomClient.ts
export interface IRandomClient {
	/**
	 * Triggers resolution of stuck contests
	 */
	crank(): Promise<void>

	/**
	 * Claim provider rewards
	 */
	claimRewards(): Promise<void>

    /**
     * Retrieves the number of available random values associated with the specified provider.
     * @param provider - The identifier for the provider.
     * @returns - A promise that resolves with the number of available random values for the provider.
     */
    getProviderAvailableValues(provider: string): Promise<GetProviderAvailableValuesResponse>;

    /**
     * Updates the count of available random values for a specific provider.
     * @param amount - The new amount of random values available.
     * @param info - An optional MonitoringData object containing provider monitoring information.
     * @returns - A promise that resolves with a boolean indicating success.
     */
    updateProviderAvailableValues(amount: number, info?: MonitoringData): Promise<boolean>;

    /**
     * Retrieves all open, incomplete randomness requests for a specific provider.
     * These requests lack required inputs (modulus, proof, output).
     * @param provider - The identifier for the provider.
     * @returns - A promise that resolves with an array of open random requests.
     */
    getOpenRandomRequests(provider: string): Promise<GetOpenRandomRequestsResponse>;

    /**
     * Fetches randomness requests based on a list of request IDs.
     * @param randomnessRequestIds - Array of IDs for the randomness requests to retrieve.
     * @returns - A promise that resolves with an array of requested randomness data.
     */
    getRandomRequests(randomnessRequestIds: string[]): Promise<GetRandomRequestsResponse>;

    /**
     * Retrieves a randomness request based on a callback ID.
     * @param callbackId - The callback ID of the randomness request to retrieve.
     * @returns - A promise that resolves with the requested randomness data.
     */
    getRandomRequestViaCallbackId(callbackId: string): Promise<GetRandomRequestsResponse>;

    /**
     * Creates a new randomness request using a list of provider IDs.
     * @param providersIds - An array of provider IDs to include in the request.
     * @param requestedInputs - The number of requested random inputs.
     * @param callbackId - A unique identifier for tracking the request callback.
     * @returns - A promise that resolves with a boolean indicating success.
     */
    createRequest(providersIds: string[], requestedInputs: number, callbackId: string): Promise<boolean>;

    /**
     * Gets a list of all provider activity
     * @returns - A promise that resolves with a list of provider activity.
     */
    getAllProviderActivity(): Promise<ProviderActivity[]>

    /**
     * Gets provider activity for a given provider
     * @param providersId - An array of provider IDs to include in the request.
     * @returns - A promise that resolves with a provider activity for the given providerId
     */
    getProviderActivity(providerId: String): Promise<ProviderActivity>

	/**
	 * Gets a users info: internal balance/created at time
	 * @returns - A promise that resolves with the users info object
	 */
	getUserInfo(userId: string): Promise<GetUserInfoResponse>

	/**
	 * Gets all users info: internal balance/created at time
	 * @returns - A promise that resolves with an array of users info objects
	 */
	getAllUserInfo(): Promise<GetUserInfoResponse[]>

    /**
     * Posts a timeunlocked commitement to a randomness request
     */
    commit(params: CommitParams): Promise<void>

    /**
     * Posts a timeunlocked commitement to a randomness request
     */
    reveal(params: RevealParams): Promise<void>

	/**	
	 * Prepays for future random requests
	 */
	prepay(quantity: number, userId?: string): Promise<boolean>

	/**
	 * Redeem random credits
	 */
	redeem(providersIds?: string[], requestedInputs?: number, callbackId?: string): Promise<boolean>

}
