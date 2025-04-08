import { IArweaveDataService } from "./IArweaveDataService";

export interface IArweaveDataCachingService extends IArweaveDataService {
	/**
	 * clears the cache
	 */
	clearCache(): void;
}
