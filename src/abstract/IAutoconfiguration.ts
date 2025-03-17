import { BaseClient } from "src/core/ao/BaseClient";

export interface IAutoconfiguration<T extends BaseClient>{
    /**
     * Creates a pre-configured instance of the client using the most recent process IDs.
     * This is the recommended way to instantiate the client for most use cases.
     * 
     * @returns A configured instance of the client ready for use
     */
    autoconfiguration(): T | Promise<T>;
}