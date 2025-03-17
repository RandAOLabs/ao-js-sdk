import { BaseClient } from "src/core/ao/BaseClient";
import { UnimplementedError } from "../errors";

export interface IAutoconfiguration{

    /**
     * Creates a pre-configured instance of the client using the most recent process IDs.
     * This is the recommended way to instantiate the client for most use cases.
     * 
     * @returns A configured instance of the client ready for use
     * @throws Error if the implementation does not provide auto-configuration
     */
    autoConfiguration<T extends IAutoconfiguration>(): T | Promise<T>;
}