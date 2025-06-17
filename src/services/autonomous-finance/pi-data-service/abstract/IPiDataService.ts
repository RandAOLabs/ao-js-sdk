import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { DelegationPreferencesResponse, DelegationPreferencesResponseWithBalance, SimplifiedDelegationResponse, FLPYieldHistoryEntry } from './responses';

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

    /**
     * Gets current delegations for a specific delegated address with simplified response format
     * @param delegatedTo The wallet address to get delegations for
     * @returns Observable stream of simplified delegation responses where walletTo matches delegatedTo
     */
    getCurrentDelegationsForAddress(delegatedTo: string): Observable<SimplifiedDelegationResponse[]>;

    /**
     * Gets all messages with the Add-Own-Mint-Report action between PI_TOKEN_PROCESS_ID endpoints
     * @returns Observable stream of Arweave transactions matching the criteria
     */
    getMintReportMessages(): Observable<ArweaveTransaction[]>;

    /**
     * Gets all FLP yield history entries with timestamps
     * @returns Observable stream of FLP yield history entries
     */
    getFLPYieldHistory(): Observable<FLPYieldHistoryEntry[]>;
}
