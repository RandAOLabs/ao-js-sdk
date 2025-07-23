/**
 * ARIO Rewind Service
 * Provides Transaction Information for ARIO ARNS and ANTS
 */
export interface IARIORewindService {

	getHistoryForDomainName(domain: string): Promise<string>;
}
