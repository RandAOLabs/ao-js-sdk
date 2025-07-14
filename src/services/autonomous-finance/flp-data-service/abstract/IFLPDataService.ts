import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { Distribution } from "./responses";

/**
 * Service for retrieving data about an FLP.
 */
export interface IFLPDataSercvice {
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
}
