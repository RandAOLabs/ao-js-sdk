import { IProcessClient } from "./IBaseClient";

export interface IDryRunCachingClient extends IProcessClient {
	/**
	 * Clears DryRun Cache 
	 */
	clearCache(): void;
}