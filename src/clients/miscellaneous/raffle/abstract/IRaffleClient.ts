import { RafflePull, ViewPullsResponse, ViewEntrantsResponse, ViewRaffleOwnersResponse } from "./types";

/**
 * Interface for the Raffle Client that provides functionality for managing raffles
 * and viewing raffle pulls.
 */
export interface IRaffleClient {
    /**
     * Sets the list of entrants for the raffle.
     * @param entrants Array of entrant names
     * @returns Promise resolving to true if successful
     */
    setRaffleEntrants(entrants: string[]): Promise<boolean>;

    /**
     * Performs a raffle pull to select a winner.
     * @returns Promise resolving to true if successful
     */
    pullRaffle(): Promise<boolean>;

    /**
     * Retrieves all raffle pulls.
     * @returns Promise resolving to an object containing array of pulls
     */
    viewPulls(): Promise<ViewPullsResponse>;

    /**
     * Retrieves details of a specific raffle pull.
     * @param pullId ID of the pull to view
     * @returns Promise resolving to pull details
     */
    viewPull(pullId: string): Promise<RafflePull>;

    /**
     * Retrieves the most recent raffle pull by finding the one with the highest ID.
     * @returns Promise resolving to the most recent pull details
     */
    viewMostRecentPull(): Promise<RafflePull>;

    /**
     * Retrieves the list of entrants for a specific user's raffle.
     * @param userId ID of the user whose raffle entrants to view
     * @returns Promise resolving to array of entrant names
     */
    viewEntrants(userId: string): Promise<ViewEntrantsResponse>;

    /**
     * Retrieves details of a specific raffle pull for a user.
     * @param userId ID of the user whose pull to view
     * @param pullId ID of the pull to view
     * @returns Promise resolving to pull details
     */
    viewUserPull(userId: string, pullId: string): Promise<RafflePull>;

    /**
     * Retrieves all raffle pulls for a specific user.
     * @param userId ID of the user whose pulls to view
     * @returns Promise resolving to an object containing array of pulls
     */
    viewUserPulls(userId: string): Promise<ViewPullsResponse>;

    /**
     * Retrieves the list of all raffle owners.
     * @returns Promise resolving to array of user IDs
     */
    viewRaffleOwners(): Promise<ViewRaffleOwnersResponse>;
}
