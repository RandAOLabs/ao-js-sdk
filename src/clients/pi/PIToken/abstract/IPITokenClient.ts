import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

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

/**
 * Interface for interacting with a specific PI token process.
 */
export interface IPITokenClient {
    /**
     * Gets information about the PI token process.
     * @returns Promise resolving to a DryRunResult with token information
     */
    getInfo(): Promise<DryRunResult>;
    
    /**
     * Gets yield tick history information.
     * @returns Promise resolving to tick history data as a string
     */
    getTickHistory(): Promise<string>;
    
    /**
     * Gets the balance from the PI token process.
     * @param target Optional target wallet address. If not provided, uses the calling wallet address.
     * @returns Promise resolving to the balance as a string
     */
    getBalance(target?: string): Promise<string>;
    
    /**
     * Gets the claimable balance from the PI token process.
     * @returns Promise resolving to the claimable balance as a string
     */
    getClaimableBalance(): Promise<string>;
    
    /**
     * Parse the raw tick history string into a structured array
     * @param tickHistoryData Raw tick history data string
     * @returns Parsed tick history entries
     */
    parseTickHistory(tickHistoryData: string): TickHistoryEntry[];
}
