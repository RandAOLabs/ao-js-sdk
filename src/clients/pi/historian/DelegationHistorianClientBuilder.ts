import { BaseClientConfig } from "../../../core";
import { ClientBuilder } from "../../common/ClientBuilder";
import { DelegationHistorianClient } from "./DelegationHistorianClient";
import { DELEGATION_HISTORIAN_PROCESS_ID } from "./constants";

/**
 * Builder for creating DelegationHistorianClient instances.
 * @deprecated in favor of @see DelegationHistorianClient.defaultBuilder
 */
export class DelegationHistorianClientBuilder extends ClientBuilder<DelegationHistorianClient> {
    /**
     * Creates a new builder instance with default DelegationHistorian process ID
     */
    constructor() {
        super(DelegationHistorianClient);
        // Set the default process ID
        this.withProcessId(DELEGATION_HISTORIAN_PROCESS_ID);
    }

    /**
     * Static method to easily build a default DelegationHistorian client
     * @param cuUrl Optional Compute Unit URL to override the default
     * @returns A configured DelegationHistorianClient instance
     */
    public static build(cuUrl?: string): DelegationHistorianClient {
        const builder = new DelegationHistorianClientBuilder();
        
        // Override the CU URL if provided
        if (cuUrl) {
            builder.withAOConfig({
                MODE: 'legacy',
                CU_URL: cuUrl
            });
        }
        
        return builder.build();
    }
}
