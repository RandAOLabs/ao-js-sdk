import { Observable } from 'rxjs';
import { ARNSRecordResponse } from '../../../../clients';
import { ANTState } from '../../../../models';
import { DOMAIN } from '../domains';

/**
 * Interface for ARIO (Arweave Resource Identifier Oracle) service operations.
 * Provides functionality for resolving domain names to process IDs using ANT and ARNS services.
 */
export interface IARIOService {
	/**
	 * Gets the process ID for a given domain by resolving it through ARNS and ANT services.
	 *
	 * The domain can be in two formats:
	 * 1. Simple domain (e.g., "randao") - The entire string is used as the ANT name
	 * 2. Compound domain (e.g., "nft_randao") - Everything after the underscore is the ANT name
	 *
	 * For domains with undernames (containing underscore):
	 * - The part before the underscore is used as the undername
	 * - The part after the underscore is used as the ANT name
	 * - The process ID is retrieved from the undername record
	 *
	 * For domains without undernames:
	 * - The entire string is used as the ANT name
	 * - The process ID is retrieved from the root record (@)
	 *
	 * The resolution process:
	 * 1. Validates the domain format
	 * 2. Extracts ANT name and undername (if present)
	 * 3. Checks for cached ANT service
	 * 4. If not cached:
	 *    - Gets ARNS record for domain
	 *    - Creates and caches new ANT service
	 * 5. Gets process ID from ANT record
	 *
	 * @param domain - The domain to resolve. Can be either a Domain enum value or a custom domain string
	 * @returns Promise resolving to the process ID string
	 * @throws {InvalidDomainError} If the domain format is invalid
	 * @throws {ARNSRecordNotFoundError} If no ARNS record exists for the domain
	 * @throws {ANTRecordNotFoundError} If no ANT record exists for the ANT name
	 */
	getProcessIdForDomain(domain: DOMAIN | string): Promise<string>;

	getAntProcessId(fullName: string): Observable<string>;


	getANTStateForARName(fullName: string): Promise<ANTState>

	getARNSRecordForARName(fullName: string): Promise<ARNSRecordResponse | undefined>
}
