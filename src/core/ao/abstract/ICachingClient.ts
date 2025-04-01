import { IBaseClient } from "./IBaseClient";

export interface IDryRunCachingClient extends IBaseClient {
    /**
     * Clears DryRun Cache 
     */
    clearCache(): void;
}