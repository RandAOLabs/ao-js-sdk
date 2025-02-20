import { IARIOService } from 'src/services/ario/abstract/IARIOService';
import { ANTClient } from 'src/clients/ario/ant';
import { ARNSClient, InvalidDomainError } from 'src/clients/ario/arns';
import { ICache, ICacheConfig, newCache } from 'src/utils/cache';
import { DOMAIN_SEPARATOR, ARN_ROOT_NAME } from 'src/services/ario/constants';
import { Logger } from 'src/utils';
import { Domain } from 'src/services/ario/domains';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError } from 'src/services/ario/ARIOError';

/**
 * Service for handling ARIO operations, including ANT and ARNS record management.
 * Implements a singleton pattern to ensure only one instance exists.
 * @category Services
 */
export class ARIOService implements IARIOService {
    private static instance: ARIOService;
    private arnsClient: ARNSClient;
    private antClientCache: ICache<string, ANTClient>;

    private constructor(config: ICacheConfig = {}) {
        this.arnsClient = ARNSClient.autoConfiguration();
        this.antClientCache = newCache<string, ANTClient>(config);
    }

    public static getInstance(config: ICacheConfig = {}): ARIOService {
        if (!ARIOService.instance) {
            ARIOService.instance = new ARIOService(config);
        }
        return ARIOService.instance;
    }

    /**
     * Gets the process ID for a given domain.
     * For domains with underscores (e.g., "nft_randao"), everything after the underscore is the ANT name.
     * For domains without underscores (e.g., "randao"), the entire string is the ANT name.
     * 
     * @param domain - The domain to get the process ID for (e.g., "nft_randao" or "randao")
     * @returns Promise resolving to the process ID string
     * @throws {InvalidDomainError} If the domain format is invalid
     * @throws {ARNSRecordNotFoundError} If no ARNS record is found for the domain
     * @throws {ANTRecordNotFoundError} If no ANT record is found for the ANT name
     */
    async getProcessIdForDomain(domain: Domain | string): Promise<string> {
        // Validate domain
        this._validateDomain(domain);

        // Get the ANT name and undername from the domain
        const antName = this._getAntName(domain);
        const undername = this._getUnderName(domain);
        const hasUndername = undername !== undefined;

        // Get or create the ANT client for this domain
        const antClient = await this._getOrCreateAntClient(antName);
        // Get process ID - if we have an undername, use it, otherwise use root name (@)
        const searchName = hasUndername ? undername : ARN_ROOT_NAME;
        const record = await antClient.getRecord(searchName);
        if (!record?.transactionId) {
            throw new ANTRecordNotFoundError(hasUndername ? undername : ARN_ROOT_NAME);
        }

        return record.transactionId;
    }

    /* Private functions */

    /**
     * Validates a domain string format.
     * @param domain - The domain string to validate
     * @throws {InvalidDomainError} If the domain is empty or has an invalid format
     */
    private _validateDomain(domain: string): void {
        if (!domain) {
            throw new InvalidDomainError(domain, 'Domain cannot be empty');
        }
        if (domain.includes(DOMAIN_SEPARATOR)) {
            const [undername, antName] = domain.split(DOMAIN_SEPARATOR);
            if (!undername || !antName) {
                throw new InvalidDomainError(domain, `Expected format: undername${DOMAIN_SEPARATOR}antname or antname`);
            }
            if (domain.split(DOMAIN_SEPARATOR).length > 2) {
                throw new InvalidDomainError(domain, `Domain can only contain one ${DOMAIN_SEPARATOR}`);
            }
        }
    }

    /**
     * Extracts the ANT name from a domain string.
     * If the domain contains an underscore, returns everything after it.
     * Otherwise, returns the entire domain.
     */
    private _getAntName(domain: string): string {
        const parts = domain.split(DOMAIN_SEPARATOR);
        return parts.length > 1 ? parts[1] : domain;
    }

    /**
     * Extracts the under name from a domain string.
     * If the domain contains an underscore, returns everything before it.
     * Otherwise, returns the entire domain.
     */
    private _getUnderName(domain: string): string | undefined {
        const parts = domain.split(DOMAIN_SEPARATOR);
        return parts.length > 1 ? parts[0] : undefined;
    }

    /**
     * Gets an existing ANT client from cache or creates a new one.
     * @throws {ARNSRecordNotFoundError} If no ARNS record is found or it lacks a process ID
     */
    private async _getOrCreateAntClient(antName: string): Promise<ANTClient> {
        // Check cache first
        const cachedClient = this.antClientCache.get(antName);
        if (cachedClient) {
            return cachedClient;
        }

        // Get ARNS record to get process ID
        const arnsRecord = await this.arnsClient.getRecord(antName);
        if (!arnsRecord?.processId) {
            throw new ARNSRecordNotFoundError(antName);
        }

        // Create and cache new client
        const antClient = new ANTClient(arnsRecord.processId);
        this.antClientCache.set(antName, antClient);
        return antClient;
    }
}

// Export singleton instance
export default ARIOService.getInstance();
