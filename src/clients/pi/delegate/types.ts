/**
 * Delegate-specific types module
 * 
 * Note: Client type definitions like TokenClientMap and TokenClientPair
 * are defined in the oracle module since that's what handles client creation.
 */

/**
 * Interface for delegation form state in application UIs
 */
export interface DelegationFormState {
  /** Destination address for the delegation */
  walletTo: string;
  
  /** Delegation factor (0-10000, representing 0-100%) */
  factor: number;
  
  /** Whether the form has unsaved changes */
  formDirty: boolean;
}
