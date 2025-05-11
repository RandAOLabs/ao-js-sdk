import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { DelegationPreferencesResponse } from './responses';

/**
 * Interface for Pi Data Service operations
 */
export interface IPiDataService {
    /**
     * Gets all current delegations with their allocation responses
     * @returns Observable stream of allocation response messages
     */
    getAllPiDelegationPreferences(): Observable<DelegationPreferencesResponse[]>;
}
