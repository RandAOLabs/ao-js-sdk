import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

/**
 * Represents detailed Fair Launch Process data
 */
export interface FairLaunchProcessData {
  /** Process ID */
  processId: string;
  /** Process name */
  name: string;
  /** Current status */
  status: string;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Additional information from dryrun */
  infoData?: DryRunResult;
}

export interface FairLaunchInfo {
  /** Response action type */
  action: string;
  /** Owner of the fair launch process */
  owner: string;
  /** FLP factory process ID */
  flpFactory: string;
  /** Name of the fair launch process */
  flpName: string;
  /** Short description of the fair launch process */
  flpShortDescription: string;
  /** Long description of the fair launch process */
  flpLongDescription: string;
  /** Timestamp when the fair launch starts */
  startsAtTimestamp: string;
  /** Timestamp when the fair launch ends (optional) */
  endsAtTimestamp?: string;
  /** Deployer address */
  deployer: string;
  /** Treasury address */
  treasury: string;

  /** Token process ID */
  tokenProcess: string;
  /** Name of the token */
  tokenName: string;
  /** Ticker symbol of the token */
  tokenTicker: string;
  /** Denomination of the token */
  tokenDenomination: string;
  /** Logo of the token */
  tokenLogo: string;
  /** Disclaimer for the token */
  tokenDisclaimer: string;
  /** Timestamp when the token unlocks (optional) */
  tokenUnlockTimestamp?: string;

  /** Total number of distribution ticks */
  totalDistributionTicks: string;
  /** Token supply to use */
  tokenSupplyToUse: string;
  /** Total token supply at creation */
  totalTokenSupplyAtCreation: string;
  /** Social media links (JSON string) */
  socials: string;

  /** Decay factor for distribution */
  decayFactor: string;
  /** Last day distribution amount */
  lastDayDistribution: string;

  /** Current status of the fair launch */
  status: string;

  /** Distributed quantity */
  distributedQuantity: string;
  /** Accumulated quantity */
  accumulatedQuantity: string;
  /** Withdrawn quantity */
  withdrawnQuantity: string;

  /** Accumulated PI quantity */
  accumulatedPiQuantity: string;
  /** Quantity exchanged for PI */
  exchangedForPiQuantity: string;
  /** Withdrawn PI quantity */
  withdrawnPiQuantity: string;

  /** Current distribution tick */
  distributionTick: string;
  /** Current yield cycle (optional) */
  yieldCycle?: string;

  /** AO token process ID */
  aoToken: string;
  /** Delegation oracle process ID */
  delegationOracle: string;
  /** PI process ID */
  piProcess: string;
  /** PI token process ID */
  piTokenProcess: string;
  /** Mint reporter process ID */
  mintReporter: string;

  /** Whether general withdrawals are enabled */
  areGeneralWithdrawalsEnabled: string;
  /** Whether batch transfers are possible */
  areBatchTransfersPossible: string;
}
