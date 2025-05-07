import { ClientBuilder } from "../../common/ClientBuilder";
import { PITokenClient } from "./PITokenClient";

/**
 * Builder for creating PITokenClient instances.
 */
export class PITokenClientBuilder extends ClientBuilder<PITokenClient> {
    /**
     * Creates a new PITokenClientBuilder instance.
     */
    constructor() {
        super(PITokenClient);
    }
    
    /**
     * Static method to easily build a PIToken client with optional CU URL override
     * @param processId The PI Token process ID
     * @param cuUrl Optional Compute Unit URL to override the default
     * @returns A configured PITokenClient instance
     */
    public static build(processId: string, cuUrl?: string): PITokenClient {
        const builder = new PITokenClientBuilder()
            .withProcessId(processId);
        
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
