import { IARIOService } from './abstract/IARIOService';
import { ANTClient } from '../../../clients/ario/ant';
import { ARNSClient, ARNSRecordResponse, } from '../../../clients/ario/arns';
import { ICache, newCache } from '../../../utils/cache';
import { DOMAIN_SEPARATOR, ARN_ROOT_NAME } from './constants';
import { DOMAIN, DOMAIN_DEFAULTS } from './domains';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError } from './ARIOError';
import { ARIOServiceConfig } from './abstract/ARIOServiceConfig';
import { DryRunCachingClientConfigBuilder } from '../../../core/ao/configuration/builder';
import { Logger } from '../../../utils';
import { AO_CONFIGURATIONS } from '../../../core/ao/ao-client/configurations';
import { ProcessClientError } from '../../../clients/common/ProcessClientError';
import { InputValidationError } from '../../../clients';
import { ANTState, FullARNSName } from '../../../models';
import { from, map, Observable } from 'rxjs';

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
		this.arnsClient = config.arnsClient
		this.antClientCache = newCache<string, ANTClient>(config.cacheConfig);
		this.config = config
	}



	public static getInstance(config?: ARIOServiceConfig): ARIOService {
		if (!ARIOService.instance) {
			if (config) {
				ARIOService.instance = new ARIOService(config);
			} else {
				ARIOService.instance = new ARIOService({
					arnsClient: ARNSClient.autoConfiguration()
				});
			}
		}
		return ARIOService.instance;
	}

	async getANTStateForARName(fullName: string): Promise<ANTState> {
		const fullARNSName = new FullARNSName(fullName);
		const antClient = await this._getOrCreateAntClient(fullARNSName.getARNSName());
		return await antClient.getState()
	}

	async getARNSRecordForARName(fullName: string): Promise<ARNSRecordResponse | undefined> {
		const fullARNSName = new FullARNSName(fullName);
		return this.arnsClient.getRecord(fullARNSName.getARNSName())
	}

	getAntProcessId(fullName: string): Observable<string> {
		// Convert the Promise from getARNSRecordForARName into an Observable
		return from(this.getARNSRecordForARName(fullName)).pipe(
			map(arnsRecord => {
				// Check if the record was found
				if (!arnsRecord) {
					// If not, throw an error which will be propagated by the Observable
					throw new Error(`ARNS Record not found for name: ${fullName}`);
				}
				// If found, return the processId
				return arnsRecord.processId;
			})
		);
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
	async getProcessIdForDomain(domain: DOMAIN | string): Promise<string> {
		// Validate domain

		try {
			const processId = await this.getProcessIdFromARNSProcess(domain);
			return processId
		} catch (error: unknown) {
			// Check for rate limiting and fall back to default process ID if available
			if (error instanceof ProcessClientError) {
				const defaultProcessId = DOMAIN_DEFAULTS[domain as DOMAIN];
				if (defaultProcessId) {
					Logger.warn(`Unable to obtain process id from ARNS domain ${domain} | Using backup process ID: ${defaultProcessId}`);
					return defaultProcessId;
				}
			}
			throw error;
		}
	}

	/* Private functions */
	private async getProcessIdFromARNSProcess(domain: DOMAIN | string): Promise<string> {
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
			throw new InputValidationError(`Domain cannot be empty | Received ${domain}`);
		}
		if (domain.includes(DOMAIN_SEPARATOR)) {
			const [undername, antName] = domain.split(DOMAIN_SEPARATOR);
			if (!undername || !antName) {
				throw new InputValidationError(`Expected format: undername${DOMAIN_SEPARATOR}antname or antname | Received ${domain}`);
			}
			if (domain.split(DOMAIN_SEPARATOR).length > 2) {
				throw new InputValidationError(`Domain can only contain one ${DOMAIN_SEPARATOR} | Received: ${domain}`);
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
			.withWallet(this.arnsClient.getWallet())
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.build()
		const antClient = new ANTClient(config);
		this.antClientCache.set(antName, antClient);
		return antClient;
	}
}
