import { SweepstakesPull, ViewSweepstakesPullsResponse, ViewSweepstakesEntrantsResponse, ViewSweepstakesOwnersResponse } from "./types";

/**
 * Interface for the Sweepstakes Client that provides functionality for managing sweepstakess
 * and viewing sweepstakes pulls.
 */
export interface ISweepstakesClient {
    /**
     * Sets the list of entrants for the sweepstakes.
     * @param entrants Array of entrant names
     * @returns Promise resolving to true if successful
     */
    setSweepstakesEntrants(entrants: string[]): Promise<boolean>;

    /**
     * Performs a sweepstakes pull to select a winner.
     * @returns Promise resolving to true if successful
     */
    pullSweepstakes(): Promise<boolean>;

    /**
     * Retrieves the list of entrants for a specific user's sweepstakes.
     * @param userId ID of the user whose sweepstakes entrants to view
     * @returns Promise resolving to array of entrant names
     */
    viewSweepstakesEntrants(userId: string): Promise<ViewSweepstakesEntrantsResponse>;

    /**
     * Retrieves details of a specific sweepstakes pull for a user.
     * @param userId ID of the user whose pull to view
     * @param pullId ID of the pull to view
     * @returns Promise resolving to pull details
     */
    viewUserSweepstakesPull(userId: string, pullId: string): Promise<SweepstakesPull>;

    /**
     * Retrieves all sweepstakes pulls for a specific user.
     * @param userId ID of the user whose pulls to view
     * @returns Promise resolving to an object containing array of pulls
     */
    viewUserSweepstakesPulls(userId: string): Promise<ViewSweepstakesPullsResponse>;

    /**
     * Retrieves the list of all sweepstakes owners.
     * @returns Promise resolving to array of user IDs
     */
    viewSweepstakesOwners(): Promise<ViewSweepstakesOwnersResponse>;

	/**
	 * Retrieves all sweepstakes pulls for a specific user.
	 * @returns Promise resolving to an object containing array of pulls
	 */
	registerSweepstakes(entrants: string[]): Promise<Boolean>;
}
