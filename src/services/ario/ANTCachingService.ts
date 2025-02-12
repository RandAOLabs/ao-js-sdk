import { ANT, ANTRecords, AoANTRead, AoANTRecord } from '@ar.io/sdk';
import { getANT } from 'src/services/ario/ario';
import { ICache, ICacheConfig, newCache } from 'src/utils/cache';
import { CACHE_KEYS, ARN_ROOT_NAME } from './constants';

/**
 * Service for caching ANT (Arweave Name Token) records.
 * Provides cached access to ANT records and maintains a local cache to reduce API calls.
 */
export class ANTCachingService {
    private cache: ICache<string, ANTRecords>;
    private ant: AoANTRead;

    /**
     * Creates a new ANTCachingService instance.
     * @param processId - The process ID to initialize the ANT service with
     * @param config - Optional cache configuration
     */
    constructor(processId: string, config: ICacheConfig = {}) {
        this.ant = getANT(processId);
        this.cache = newCache<string, ANTRecords>(config);
    }

    /**
     * Retrieves all ANT records, using cached data if available.
     * @returns Promise resolving to a record of ANT records
     */
    async getRecords(): Promise<ANTRecords> {
        const cached = this.cache.get(CACHE_KEYS.ANT.GET_RECORDS);
        if (cached !== undefined) return cached

        const records = await this.ant.getRecords()
        if (records !== undefined) {
            this.cache.set(CACHE_KEYS.ANT.GET_RECORDS, records);
        }
        return records;
    }

    /**
     * Retrieves a specific ANT record by name.
     * @param undername - Either the default ANT name ("@") or a undername
     * @returns Promise resolving to the ANT record if found, undefined otherwise
     */
    async getRecord(undername_or_at: string | typeof ARN_ROOT_NAME): Promise<AoANTRecord | undefined> {
        const records = await this.getRecords()
        return records[undername_or_at]
    }

    /**
     * Gets the process ID for a specific ANT record.
     * @param undername_or_at - Either the default ANT name ("@") or an undername
     * @returns Promise resolving to the process ID if found, undefined otherwise
     */
    async getProcessId(undername_or_at: string | typeof ARN_ROOT_NAME): Promise<string | undefined> {
        const record = await this.getRecord(undername_or_at);
        return record?.transactionId;
    }
}
