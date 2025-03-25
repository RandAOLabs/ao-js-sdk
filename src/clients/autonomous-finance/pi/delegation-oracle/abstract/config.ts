import { BaseClientConfig } from "src/core/ao/configuration/BaseClientConfig";

export interface DelegationOracleClientConfig extends BaseClientConfig {
    /**
     * The process ID for the delegation oracle
     */
    processId: string;
}
