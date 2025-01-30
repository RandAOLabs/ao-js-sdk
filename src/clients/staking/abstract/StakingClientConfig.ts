import { BaseClientConfig } from "../../../core/abstract/BaseClientConfig"

export interface StakingClientConfig extends BaseClientConfig {
    /**
     * Process ID for the token contract used for staking
     */
    tokenProcessId: string;
}
