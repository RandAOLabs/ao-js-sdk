import { IARIOService } from './abstract/IARIOService';
import { ANTCachingService } from './ANTCachingService';
import { ArnsCashingService } from './ARNCachingService';
import { ICache, ICacheConfig, newCache } from 'src/utils/cache';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError, InvalidDomainError } from './ARIOError';
import { DOMAIN_SEPARATOR, ARN_ROOT_NAME } from './constants';
import { Logger } from 'src/utils';
import { Domain } from './domains';

/**
 * Service for handling ARIO operations, including ANT and ARNS record management.
 * Implements a singleton pattern to ensure only one instance exists.
 * @category Services
 */
export class ARIOService implements IARIOService {
    private static instance: ARIOService;
    private arnsService: ArnsCashingService;
    private antServiceCache: ICache<string, ANTCachingService>;

    private constructor(config: ICacheConfig = {}) {
        this.arnsService = new ArnsCashingService(config);
        this.antServiceCache = newCache<string, ANTCachingService>(config);
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
        Logger.debug(antName);
        Logger.debug(undername);

        // Get or create the ANT service for this domain
        const antService = await this._getOrCreateAntService(domain, antName);

        // Get process ID - if we have an undername, use it, otherwise use root name (@)
        const searchName = hasUndername ? undername : ARN_ROOT_NAME;
        Logger.debug(searchName)
        const processId = await antService.getProcessId(searchName);
        if (!processId) {
            throw new ANTRecordNotFoundError(hasUndername ? undername : ARN_ROOT_NAME);
        }
        Logger.debug(processId)

        return processId;
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
     * Gets an existing ANT service from cache or creates a new one.
     * @throws {ARNSRecordNotFoundError} If no ARNS record is found or it lacks a process ID
     */
    private async _getOrCreateAntService(domain: string, antName: string): Promise<ANTCachingService> {
        // Check cache first
        const cachedService = this.antServiceCache.get(antName);
        if (cachedService) {
            return cachedService;
        }

        // Get ARNS record to get process ID
        const arnsRecord = await this.arnsService.getArNSRecord({ name: domain });
        Logger.debug(arnsRecord)
        if (!arnsRecord?.processId) {
            throw new ARNSRecordNotFoundError(domain);
        }

        // Create and cache new service
        const antService = new ANTCachingService(arnsRecord.processId);
        this.antServiceCache.set(antName, antService);
        return antService;
    }
}

// Export singleton instance
export default ARIOService.getInstance();
