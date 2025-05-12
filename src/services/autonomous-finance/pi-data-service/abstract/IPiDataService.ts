import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { DelegationPreferencesResponse, DelegationPreferencesResponseWithBalance } from './responses';

/**
 * Interface for Pi Data Service operations
 */
export interface IPiDataService {
    /**
     * Gets all current delegations with their allocation responses
     * @returns Observable stream of allocation response messages
     */
    getAllPiDelegationPreferences(): Observable<DelegationPreferencesResponse[]>;

    /**
     * Gets all current delegations with their allocation responses and wallet balances
     * @returns Observable stream of allocation response messages with balances
     */
    getAllPiDelegationPreferencesWithBalances(): Observable<DelegationPreferencesResponseWithBalance[]>;
}
