import { IARNSClient } from "src/clients/ario/arns/abstract/IARNSClient";
import { getARNSClientAutoConfiguration } from "src/clients/ario/arns/ARNSClientAutoConfiguration";
import { GetARNSRecordError, InvalidDomainError } from "src/clients/ario/arns/ARNSClientError";
import { ARNSRecord } from "src/clients/ario/arns/abstract/types";
import { DOMAIN_SEPARATOR } from "src/clients/ario/arns/constants";
import { Logger, LogLevel } from "src/utils";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import { ISyncAutoConfiguration } from "src/core/ao/abstract";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { IAutoconfiguration } from "src/abstract";

/**
 * Client for interacting with ARNS (Arweave Name Service) records.
 * @category ARIO
 */
export class ARNSClient extends DryRunCachingClient implements IARNSClient, IAutoconfiguration<ARNSClient> {
    public static autoConfiguration(): ARNSClient {
        return new ARNSClient(getARNSClientAutoConfiguration());
    }

    /**
     * Retrieves an ARNS record for a given name.
     * @param name - The name to get the ARNS record for
     * @returns Promise resolving to the ARNS record if found, undefined otherwise
     */
    public async getRecord(name: string): Promise<ARNSRecord | undefined> {
        try {
            // Validate name format
            this.validateDomainFormat(name);

            const result = await this.dryrun('', [
                { name: "Action", value: "Record" },
                { name: "Name", value: name }
            ]);
            return ResultUtils.getFirstMessageDataJson<ARNSRecord>(result);
        } catch (error: any) {
            throw new GetARNSRecordError(name, error);
        }
    }

    /**
     * Gets the process ID for this client.
     * @returns The process ID string
     */
    public getProcessId(): string {
        return super.getProcessId();
    }

    /**
     * Validates a domain string format.
     * @param domain - The domain string to validate
     * @throws {InvalidDomainError} If the domain is empty or has an invalid format
     */
    private validateDomainFormat(domain: string): void {
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
}
