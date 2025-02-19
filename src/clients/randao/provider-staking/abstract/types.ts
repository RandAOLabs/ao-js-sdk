export interface ProviderStakeInfo {
    /** Timestamp of the stake */
    timestamp: number;
    /** Status of the stake (active, unstaking) */
    status: string;
    /** Amount staked */
    amount: string;
    /** Token ID */
    token: string;
    /** Provider ID */
    provider_id: string;
}
