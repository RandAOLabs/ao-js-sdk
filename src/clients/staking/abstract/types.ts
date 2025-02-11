export interface ProviderInfoDTO {
    /** Active challenge requests JSON string */
    active_challenge_requests?: string;
    /** Random balance */
    random_balance: number;
    /** Active output requests JSON string */
    active_output_requests?: string;
    /** Active status */
    active: number;
    /** Creation timestamp */
    created_at: number;
    /** Provider details JSON string */
    provider_details?: string;
    /** Stake information JSON string */
    stake: string;
    /** Provider ID */
    provider_id: string;
}

export interface ProviderDetails {
    /** Provider name */
    name?: string;
    /** Commission percentage (1-100) */
    commission?: number;
    /** Provider description */
    description?: string;
    /** Optional Twitter handle */
    twitter?: string;
    /** Optional Discord handle */
    discord?: string;
    /** Optional Telegram handle */
    telegram?: string;
    /** Optional domain */
    domain?: string;
}

export interface StakeInfo {
    /** Timestamp of the stake */
    timestamp: number;
    /** Status of the stake (active, unstaking) */
    status: string;
    /** Amount staked */
    amount: number;
    /** Token ID */
    token: string;
    /** Provider ID */
    provider_id: string;
}

export interface ProviderInfo {
    /** Active challenge requests */
    active_challenge_requests?: { request_ids: string[] };
    /** Random balance */
    random_balance: number;
    /** Active output requests */
    active_output_requests?: { request_ids: string[] };
    /** Active status */
    active: number;
    /** Creation timestamp */
    created_at: number;
    /** Provider details */
    provider_details?: ProviderDetails;
    /** Stake information */
    stake: StakeInfo;
    /** Provider ID */
    provider_id: string;
}
