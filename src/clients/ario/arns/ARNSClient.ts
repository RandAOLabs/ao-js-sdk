import { IARNSClient } from "src/clients/ario/arns/abstract/IARNSClient";
import { ARNSRecord } from "src/clients/ario/arns/abstract/types";
import { DOMAIN_SEPARATOR } from "src/clients/ario/arns/constants";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder } from "src/utils/class-interfaces";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { ClientBuilder } from "src/clients/common";
import { staticImplements } from "src/utils";
import { PROCESS_IDS } from "src/process-ids";
import { ClientError } from "src/clients/common/ClientError";
import { InputValidationError } from "src/clients/bazar";

/**
 * Client for interacting with ARNS (Arweave Name Service) records.
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ARNSClient extends DryRunCachingClient implements IARNSClient {
    public static autoConfiguration(): ARNSClient {
        return ARNSClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<ARNSClient> {
        return new ClientBuilder(ARNSClient)
            .withProcessId(PROCESS_IDS.ARIO.ARNS_REGISTRY)
            .withAOConfig(AO_CONFIGURATIONS.ARDRIVE)
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
            throw new ClientError(this, this.getRecord, { name }, error);
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
}
