import { Observable } from "rxjs";
import { IARNSEvent } from "../events";
import { ARNameDetail } from "./responseTypes";

/**
 * ARIO Rewind Service
 * Provides Transaction Information for ARIO ARNS and ANTS
 */
export interface IARIORewindService {

	/**
	 * Retrieves the event history for a given ARNS name.
	 * The fullName parameter can be either:
	 * - A top-level ARN (e.g., "name")
	 * - An ARN with an undername (e.g., "undername_name")
	 *
	 * @param fullName The full ARNS name to get event history for
	 * @returns Observable of ARNS undername name events
	 */
	getEventHistory(fullName: string): Observable<IARNSEvent[]>;

	getAntDetail(fullName: string): Promise<ARNameDetail>;
}
