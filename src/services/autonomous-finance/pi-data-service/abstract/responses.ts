/**
 * Represents a single delegation preference entry
 */
export interface DelegationPreference {
    /**
     * The wallet address to delegate to
     */
    walletTo: string;

    /**
     * The delegation factor/weight
     */
    factor: number;
}

/**
 * Represents a complete delegation preferences response
 */
/**
 * Represents a delegation preferences response with balance information
 */
export interface DelegationPreferencesResponseWithBalance extends DelegationPreferencesResponse {
    /**
     * The wallet balance in Winston (divide by 1000000000000 to get AR)
     */
    balance: number;
}

export interface DelegationPreferencesResponse {
    /**
     * Base key identifier
     */
    _key: string;

    /**
     * Timestamp of last update
     */
    lastUpdate: number;

    /**
     * Array of delegation preferences
     */
    delegationPrefs: DelegationPreference[];

    /**
     * Sum of all delegation factors
     */
    totalFactor: number;

    /**
     * The wallet address this delegation is for
     */
    wallet: string;
}
