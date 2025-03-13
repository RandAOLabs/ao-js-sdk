import { IARIOService } from 'src/services/ario/abstract/IARIOService';
import { ANTClient, GetANTRecordError } from 'src/clients/ario/ant';
import { ARNSClient, GetARNSRecordError, InvalidDomainError } from 'src/clients/ario/arns';
import { ICache, newCache } from 'src/utils/cache';
import { DOMAIN_SEPARATOR, ARN_ROOT_NAME } from 'src/services/ario/constants';
import { Domain, DOMAIN_DEFAULTS } from 'src/services/ario/domains';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError } from 'src/services/ario/ARIOError';
import { ARIOServiceConfig } from 'src/services/ario/abstract/ARIOServiceConfig';
import { getARNSClientAutoConfiguration } from 'src/clients/ario/arns/ARNSClientAutoConfiguration';
import { DryRunCachingClientConfigBuilder } from 'src/core/ao/configuration/builder';
import { Logger } from 'src/utils';

/**
 * Service for handling ARIO operations, including ANT and ARNS record management.
 * Implements a singleton pattern with lazy initialization to ensure only one instance exists.
 * @category ARIO
 */
export class ARIOService implements IARIOService {
    private static instance: ARIOService | null = null;
    private arnsClient: ARNSClient;
    private antClientCache: ICache<string, ANTClient>;
    private config: ARIOServiceConfig;

    private constructor(config: ARIOServiceConfig) {
        this.arnsClient = new ARNSClient(config.arnsClientConfig)
        this.antClientCache = newCache<string, ANTClient>(config.cacheConfig);
        this.config = config
    }

    public static getInstance(config?: ARIOServiceConfig): ARIOService {
        if (!ARIOService.instance) {
            if (config) {
                ARIOService.instance = new ARIOService(config);
            } else {
                ARIOService.instance = new ARIOService({
                    arnsClientConfig: getARNSClientAutoConfiguration()
                });
            }
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

        try {
            const processId = await this.getProcessIdFromARNSProcess(domain);
            return processId
        } catch (error: unknown) {
            // Check for rate limiting and fall back to default process ID if available
            if (error instanceof GetANTRecordError || error instanceof GetARNSRecordError) {
                const defaultProcessId = DOMAIN_DEFAULTS[domain as Domain];
                if (defaultProcessId) {
                    Logger.warn(`Unable to obtain process id from ARNS domain ${domain} | Using backup process ID: ${defaultProcessId}`);
                    return defaultProcessId;
                }
            }
            throw error;
        }
    }

    /* Private functions */
    private async getProcessIdFromARNSProcess(domain: Domain | string): Promise<string> {
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
            Logger.debug(`Using Cached Ant Client for ${antName}`) // Leave this debug log in as its useful
            return cachedClient;
        }

        // Get ARNS record to get process ID
        const arnsRecord = await this.arnsClient.getRecord(antName);
        if (!arnsRecord?.processId) {
            throw new ARNSRecordNotFoundError(antName);
        }

        // Create and cache new client
        const config = new DryRunCachingClientConfigBuilder()
            .withProcessId(arnsRecord.processId)
            .withWallet(this.config.arnsClientConfig.wallet)
            .build()
        const antClient = new ANTClient(config);
        this.antClientCache.set(antName, antClient);
        return antClient;
    }
}
