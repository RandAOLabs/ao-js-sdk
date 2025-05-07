import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { TickHistoryEntry } from "./abstract/IPITokenClient";

/**
 * Represents detailed token data including balance and history
 */
export interface TokenData {
  /** Token ID */
  tokenId: string;
  /** Process ID */
  processId: string;
  /** Token ticker symbol */
  ticker: string;
  /** Token name */
  name: string;
  /** Current PI token balance */
  balance: string;
  /** Claimable PI token balance */
  claimableBalance: string;
  /** Token tick history */
  tickHistory: TickHistoryEntry[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Treasury address */
  treasury?: string;
  /** Token status */
  status?: string;
  /** URL to token logo */
  logoUrl?: string;
  /** Additional token information from dryrun */
  infoData?: DryRunResult;
  
  /** Base token balance */
  baseBalance?: string;
  /** Base token info */
  baseInfo?: DryRunResult;
}

// TokenClientMap moved to oracle/types.ts to avoid export name collisions
