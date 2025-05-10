import { BaseClientConfig } from "../../core/ao/configuration/BaseClientConfig";
import { ConnectArgsLegacy } from "../../core/ao/ao-client/aoconnect-types";

export interface TokenInterfacingClientConfig extends BaseClientConfig {
    /**
     * Process ID for the token contract used for staking
     */
    tokenProcessId: string;
    tokenAOConfig: ConnectArgsLegacy;
}
