import { IBaseClient } from "src/core/ao/abstract/IBaseClient";

export interface IDryRunCachingClient extends IBaseClient {
    /**
     * Clears DryRun Cache 
     */
    clearCache(): void;
}