import { IBaseClient } from "src/core/ao/abstract/IBaseClient";
import { BaseClient } from "src/core/ao/BaseClient";

export abstract class ISyncAutoConfiguration extends BaseClient {
    /**
     * Creates a pre-configured instance of the client using the most recent process IDs.
     * This is the recommended way to instantiate the client for most use cases.
     * 
     * @returns A configured instance of the client ready for use
     * @throws Error if the implementation does not provide auto-configuration
     */
    public static autoConfiguration(): ISyncAutoConfiguration {
        throw new Error("Method not implemented")
    }
}