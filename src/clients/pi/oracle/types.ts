import { PITokenClient } from "../PIToken/PITokenClient";
import { TokenClient } from "../../ao";

/**
 * Represents a pair of token clients - one for PI token operations and one for base token operations
 */
export interface TokenClientPair {
  /** Client for PI-specific token operations */
  piClient: PITokenClient;
  
  /** Client for base token operations */
  baseClient: TokenClient;
}

/**
 * Mapping of token process IDs to their client instances
 */
export interface TokenClientMap {
  [key: string]: TokenClientPair;
}

/**
 * Structure tracking loading states for various PI token operations
 * This is primarily used by frontends but defined here for consistency
 */
export interface StateStructure {
  /** Loading state for oracle client initialization */
  oracleClient: boolean;
  
  /** Loading state for delegate client initialization */
  delegateClient: boolean;
  
  /** Loading state for delegate info fetch */
  delegateInfo: boolean;
  
  /** Loading state for PI tokens fetch */
  piTokens: boolean;
  
  /** Loading state for token info fetch */
  tokenInfo: boolean;
  
  /** Loading state for tick history fetch */
  tickHistory: boolean;
  
  /** Loading state for balance fetch */
  balance: boolean;
  
  /** Loading state for claimable balance fetch */
  claimableBalance: boolean;
  
  /** Loading state for token clients creation */
  tokenClients: boolean;
  
  /** Loading state for token client pairs creation */
  tokenClientPairs: boolean;
  
  /** Loading state for delegation info fetch */
  delegationInfo: boolean;
  
  /** Loading state for delegation update operation */
  updatingDelegation: boolean;
}
