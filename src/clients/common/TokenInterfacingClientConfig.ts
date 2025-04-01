import { BaseClientConfig } from "../../core/ao/configuration/BaseClientConfig"

export interface TokenInterfacingClientConfig extends BaseClientConfig {
    /**
     * Process ID for the token contract used for staking
     */
    tokenProcessId: string;
}
