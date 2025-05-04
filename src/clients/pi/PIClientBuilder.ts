import { BaseClientConfig, BaseClientConfigBuilder } from "../../core";
import { ClientBuilder } from "../common/ClientBuilder";
import { PIClient } from "./PIClient";
import { PI_DELEGATE_PROCESS_ID, PI_TOKEN_PROCESS_ID } from "./constants";

/**
 * Builder for creating PIClient instances with customizable configurations.
 */
export class PIClientBuilder extends ClientBuilder<PIClient> {
    // Create our own config builder to work with
    private _configBuilder: BaseClientConfigBuilder;
    
    constructor() {
        super(PIClient);
        this._configBuilder = new BaseClientConfigBuilder();
    }

    /**
     * Set the PI Token process ID
     * @param processId The process ID to use for PI Token operations
     * @returns this builder instance for chaining
     */
    withPITokenProcess(processId: string): this {
        this.withProcessId(processId);
        return this;
    }

    /**
     * Set the Delegate process ID
     * @param processId The process ID to use for delegation operations
     * @returns this builder instance for chaining
     */
    withDelegateProcess(processId: string): this {
        this.withProcessId(processId);
        return this;
    }
    
    /**
     * Set the Delegation Oracle process ID
     * @param processId The process ID to use for delegation oracle operations
     * @returns this builder instance for chaining
     */
    withDelegationOracleProcess(processId: string): this {
        // Note: We're still using withProcessId as the primary method to set process IDs
        // The concrete process selection happens in the PIClient methods
        this.withProcessId(processId);
        return this;
    }
    


    /**
     * Build a PIClient with default process IDs if not explicitly set
     * @returns A configured PIClient instance
     */
    build(): PIClient {
        // Use default process IDs if not set explicitly
        if (!this.hasProcessId()) {
            this.withProcessId(PI_TOKEN_PROCESS_ID);
        }
        
        return super.build();
    }
    
    /**
     * Helper method to check if a process ID has been set
     * @returns true if a process ID has been set, false otherwise
     */
    private hasProcessId(): boolean {
        // We can't directly access the config builder's internal state from the parent class
        // So we'll work with a flag that we set when withProcessId is called
        return this._processIdSet;
    }
    
    // Track if a process ID has been set
    private _processIdSet: boolean = false;
    
    /**
     * Override withProcessId to track the set status
     */
    override withProcessId(processId: string): this {
        super.withProcessId(processId);
        this._processIdSet = true;
        return this;
    }
}
