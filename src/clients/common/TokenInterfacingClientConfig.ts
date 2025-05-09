import { BaseClientConfig } from "../../core/ao/configuration/BaseClientConfig"

/**
 * Represents input for token configuration that can be either:
 * - A string (token process ID)
 * - An object with optional tokenProcessId and aoConfig
 */
export type TokenInput =
  | string
  | { tokenProcessId?: string; aoConfig?: any };

export interface TokenInterfacingClientConfig extends BaseClientConfig {
    /**
     * Process ID for the token contract used for staking
     */
    tokenProcessId: string;
}
