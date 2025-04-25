import { SweepstakesPull, ViewAllSweepstakesResponse, ViewOneSweepstakesResponse } from "./types";

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
    setSweepstakesEntrants(entrants: string[], sweepstakesId: string): Promise<boolean>;
	
	/**
	 * Adds an entrant to the sweepstakes.
	 * @param entrant Name of the entrant to add
	 * @returns Promise resolving to true if successful
	 */
	addSweepstakesEntrant(entrant: string, sweepstakesId: string): Promise<boolean>;

    /**
     * Performs a sweepstakes pull to select a winner.
     * @returns Promise resolving to true if successful
     */
    pullSweepstakes(sweepstakesId: string, details: string): Promise<boolean>;

    /**
     * Retrieves the sweepstakes for a specific id.
     * @param sweepstakesId ID of the sweepstakes to view
     * @returns Promise resolving to sweepstakes details
     */
    viewSweepstakes(sweepstakesId: string): Promise<ViewOneSweepstakesResponse>;

	/**
	 * Retrieves the list of all sweepstakes.
	 * @returns Promise resolving to array of sweepstakes
	 */
	viewAllSweepstakes(): Promise<ViewAllSweepstakesResponse>

    /**
     * Retrieves details of a specific sweepstakes pull for a user.
     * @param userId ID of the user whose pull to view
     * @param pullId ID of the pull to view
     * @returns Promise resolving to pull details
     */
    viewSweepstakesPull(pullId: string, sweepstakesId: string): Promise<SweepstakesPull>;

	/**
	 * Retrieves all sweepstakes pulls for a specific user.
	 * @returns Promise resolving to an object containing array of pulls
	 */
	registerSweepstakes(entrants: string[], details: string): Promise<Boolean>;
}
