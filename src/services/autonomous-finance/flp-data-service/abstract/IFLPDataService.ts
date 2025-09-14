import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { Distribution } from "./responses";

/**
 * Service for retrieving data about an FLP.
 */
export interface IFLPDataService {
	/**
	 * Gets the most recent distributions
	 * @returns Promise resolving to the most recent distributions
	 */
	getMostRecentDistributions(): Promise<Distribution[]>;

	/**
	 * Gets the most recent distribution for a specific user
	 * @param address The user's address
	 * @returns Promise resolving to the user's most recent distribution, or null if not found
	 */
	getUsersMostRecentDistributions(address: string): Promise<Distribution | null>;

	/**
	 * Gets the number of delegators
	 * @returns Promise resolving to the number of delegators based on the most recent distributions
	 */
	getNumDelegators(): Promise<number>;
}
