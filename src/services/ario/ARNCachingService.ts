import { AoARIORead, AoArNSNameData } from '@ar.io/sdk/lib/types/types/io';
import { getARIO } from 'src/services/ario/ario';
import { ArNSRecordRequest } from 'src/services/ario/types';
import { ICache, ICacheConfig, newCache } from 'src/utils/cache';

/**
 * Service for caching ARNS (Arweave Resource Name Service) records.
 * Provides cached access to ARNS records and maintains a local cache to reduce API calls.
 */
export class ArnsCashingService {
    private cache: ICache<string, AoArNSNameData>;
    private ario: AoARIORead;

    /**
     * Creates a new ARNSCachingService instance.
     * @param config - Optional cache configuration
     */
    constructor(config: ICacheConfig = {}) {
        this.ario = getARIO();
        this.cache = newCache<string, AoArNSNameData>(config);
    }

    /**
     * Retrieves an ARNS record for a given name, using cached data if available.
     * @param name - The name to get the ARNS record for
     * @returns Promise resolving to the ARNS record if found, undefined otherwise
     */
    async getArNSRecord({ name }: ArNSRecordRequest): Promise<AoArNSNameData | undefined> {
        const cached = this.cache.get(name);
        if (cached !== undefined) return cached;

        const arnsRecord = await this.ario.getArNSRecord({ name });
        if (arnsRecord !== undefined) {
            this.cache.set(name, arnsRecord);
        }
        return arnsRecord;
    }
}
