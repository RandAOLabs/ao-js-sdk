import { BaseClientConfig } from "../../../core";
import { ClientBuilder } from "../../common/ClientBuilder";
import { DELEGATION_ORACLE_PROCESS_ID } from "../constants";
import { PIOracleClient } from "./PIOracleClient";

/**
 * Builder for creating PIOracleClient instances.
 */
export class PIOracleClientBuilder extends ClientBuilder<PIOracleClient> {
    /**
     * Creates a new builder instance with default Oracle process ID
     */
    constructor() {
        super(PIOracleClient);
        // Set the default process ID to the delegation oracle
        this.withProcessId(DELEGATION_ORACLE_PROCESS_ID);
    }

    /**
     * Static method to easily build a default Oracle client
     * @returns A configured PIOracleClient instance
     */
    public static build(): PIOracleClient {
        return new PIOracleClientBuilder().build();
    }
}
