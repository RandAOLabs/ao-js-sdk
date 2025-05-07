import { BaseClientConfig } from "../../../core";
import { ClientBuilder } from "../../common/ClientBuilder";
import { PIDelegateClient } from "./PIDelegateClient";
import { PI_DELEGATE_PROCESS_ID } from "../constants";

/**
 * Builder for creating PIDelegateClient instances.
 */
export class PIDelegateClientBuilder extends ClientBuilder<PIDelegateClient> {
    constructor() {
        super(PIDelegateClient);
        // Default to the PI delegate process ID
        this.withProcessId(PI_DELEGATE_PROCESS_ID);
    }
    
    /**
     * Static method to easily build a default Delegate client
     * @param cuUrl Optional Compute Unit URL to override the default
     * @returns A configured PIDelegateClient instance
     */
    public static build(cuUrl?: string): PIDelegateClient {
        const builder = new PIDelegateClientBuilder();
        
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
