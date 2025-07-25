import { IARNSClient } from "./abstract/IARNSClient";
import { DOMAIN_SEPARATOR } from "./constants";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder } from "../../../utils/class-interfaces";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { ClientBuilder } from "../../common";
import { staticImplements } from "../../../utils";
import { PROCESS_IDS } from "../../../processes/ids";
import { ClientError } from "../../common/ClientError";
import { InputValidationError } from "../../bazar";
import { ARNS_QUERY_TAGS } from "../../../models";
import { ARNSRecordResponse } from "./abstract";

/**
 * Client for interacting with ARNS (Arweave Name Service) records.
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ARNSClient extends DryRunCachingClient implements IARNSClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): ARNSClient {
		return ARNSClient.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<ARNSClient> {
		return new ClientBuilder(ARNSClient)
			.withProcessId(PROCESS_IDS.ARIO.ARNS_REGISTRY)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
	}

	/**
	 * Retrieves an ARNS record for a given name.
	 * @param name - The name to get the ARNS record for
	 * @returns Promise resolving to the ARNS record if found, undefined otherwise
	 */
	public async getRecord(name: string): Promise<ARNSRecordResponse | undefined> {
		try {
			// Validate name format
			this.validateDomainFormat(name);

			const result = await this.dryrun('', [
				ARNS_QUERY_TAGS.ACTION.RECORD,
				ARNS_QUERY_TAGS.NAME(name)
			]);
			return ResultUtils.getFirstMessageDataJson<ARNSRecordResponse>(result);
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
