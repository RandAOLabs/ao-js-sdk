/**
 * Represents the delegation preferences for a PI token.
 */
export interface DelegationPreference {
    walletTo: string;
    factor: number;
}

/**
 * Represents the complete delegation information.
 */
export interface DelegationInfo {
    totalFactor: string;
    delegationPrefs: DelegationPreference[];
    lastUpdate: number;
    wallet: string;
}

/**
 * Represents a single tick history entry
 */
export interface TickHistoryEntry {
    DistributionTick?: number;
    YieldCycle?: string;
    Timestamp: number;
    TotalMintedInTick?: string;
    TotalInflowInTick?: string;
    TriggerMintReportIds: string[];
    Nonce?: string;
    PiReceived?: string;
    AoKept?: string;
    TokensDistributed?: string;
    TokenPriceInAo?: string;
    AoReceived?: string;
}

/**
 * Represents a FLP (Farm Liquidity Provider) token
 */
export interface PIToken {
    id: string;
    flp_id: string;
    flp_name: string;
    flp_token_name: string;
    flp_token_ticker: string;
    flp_token_process: string;
    flp_token_denomination: string;
    flp_token_logo: string;
    flp_token_disclaimer?: string;
    flp_short_description?: string;
    flp_long_description?: string;
    deployer: string;
    treasury: string;
    status: string;
    created_at_ts: number;
    starts_at_ts: number;
    ends_at_ts?: number;
    last_updated_at_ts: number;
    stats_updated_at: number;
    last_day_distribution?: string;
    total_token_supply: string;
    token_supply_to_use: string;
    decay_factor: number | string;
    token_unlock_at_ts?: number;
    latest_yield_cycle?: string;
    total_yield_ticks: string;
    distributed_qty: string;
    accumulated_qty: string;
    withdrawn_qty: string;
    accumulated_pi_qty: string;
    withdrawn_pi_qty: string;
    exchanged_for_pi_qty: string;
    website_url?: string;
    twitter_handle?: string;
    telegram_handle?: string;
}

/**
 * Represents token info from the PI token process.
 */
export interface PITokenInfo {
    dataProtocol: string;
    variant: string;
    type: string;
    reference: string;
    delegationOracle: string;
    tokenSupplyToUse: string;
    decayFactor: string;
    tokenUnlockTimestamp: string;
    tokenLogo: string;
    owner: string;
    piTokenProcess: string;
    socials: string;
    flpFactory: string;
    areBatchTransfersPossible: boolean;
    accumulatedQuantity: string;
    withdrawnQuantity: string;
    exchangedForPiQuantity: string;
    tokenTicker: string;
    totalDistributionTicks: string;
    yieldCycle: string;
    distributedQuantity: string;
    aoToken: string;
    areGeneralWithdrawalsEnabled: boolean;
    piProcess: string;
    tokenDisclaimer: string;
    status: string;
    deployer: string;
    treasury: string;
    startsAtTimestamp: string;
    distributionTick: string;
    mintReporter: string;
    tokenProcess: string;
    withdrawnPiQuantity: string;
    accumulatedPiQuantity: string;
    tokenDenomination: string;
    totalTokenSupplyAtCreation: string;
    tokenName: string;
}
