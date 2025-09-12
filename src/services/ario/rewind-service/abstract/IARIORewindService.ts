import { Observable } from "rxjs";
import { ARNameDetail } from "./responseTypes";
import { IARNSInitialMainnetStateService } from "../../arns-initial-mainnet-state-service/abstract/IARNSInitialMainnetStateService";
import { IARNSEvent } from "../events";

/**
 * ARIO Rewind Service
 * Provides Transaction Information for ARIO ARNS and ANTS
 */
export interface IARIORewindService extends IARNSInitialMainnetStateService {

	/**
	 * Retrieves the event history for a given ARNS name.
	 * The fullName parameter can be either:
	 * - A top-level ARN (e.g., "name")
	 * - An ARN with an undername (e.g., "undername_name")
	 *
	 * @param fullName The full ARNS name to get event history for
	 * @returns Observable of ARNS undername name events sorted by timestamp (earliest first)
	 */
	getEventHistory$(fullName: string): Observable<IARNSEvent[]>;

	/**
	 * Retrieves the event history for a given ARNS name.
	 * The fullName parameter can be either:
	 * - A top-level ARN (e.g., "name")
	 * - An ARN with an undername (e.g., "undername_name")
	 *
	 * @param fullName The full ARNS name to get event history for
	 * @returns Promise of ARNS undername name events sorted by timestamp (earliest first)
	 */
	getEventHistory(fullName: string): Promise<IARNSEvent[]>;

	/**
	 * @param fullName The full ARNS name to get event history for
	 * @returns Promise of ARName Details
	 */
	getAntDetail(fullName: string): Promise<ARNameDetail>;

	/**
	 * Gets a random ARNS name using entropy as a random seed
	 * @returns Promise of a random ARNS name string
	 */
	getRandomARNSName(): Promise<string>;
}
