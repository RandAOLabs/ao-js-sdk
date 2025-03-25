import { BaseClient } from "src/core/ao/BaseClient";
import { IDelegationOracleClient, DelegationOracleClientConfig, GetDelegationsParams, GetDelegationsResponse } from "./abstract";
import { Tags } from "src/core";
import { ClientError } from "src/clients/common/ClientError";
import { TAGS } from "./tags";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "src/utils";
import { PROCESS_IDS } from "src/process-ids";
import { ClientBuilder } from "src/clients/common/ClientBuilder";
import { IClassBuilder } from "src/utils/class-interfaces/IClientBuilder";
import ResultUtils from "src/core/common/result-utils/ResultUtils";

/**
 * @category Autonomous Finance
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()
export class DelegationOracleClient extends BaseClient implements IDelegationOracleClient {
    /* Constructors */
    public constructor(config: DelegationOracleClientConfig) {
        super(config);
    }

    public static async autoConfiguration(): Promise<DelegationOracleClient> {
        const builder = await DelegationOracleClient.defaultBuilder();
        return builder.build();
    }

    public static builder(): ClientBuilder<DelegationOracleClient> {
        return new ClientBuilder(DelegationOracleClient);
    }

    public static async defaultBuilder(): Promise<ClientBuilder<DelegationOracleClient>> {
        return DelegationOracleClient.builder()
            .withProcessId(PROCESS_IDS.AUTONOMOUS_FINANCE.PERMAWEB_INDEX.DELEGATION_ORACLE);
    }
    /* Constructors */

    /* Core Functions */
    async getDelegations(params: GetDelegationsParams): Promise<GetDelegationsResponse> {
        try {
            const tags: Tags = [
                TAGS.ACTION.DELEGATION_RECORDS,
                { name: "Index", value: params.index.toString() },
                { name: "Total", value: (params.total || 1).toString() }
            ];

            // Add optional parameters if provided
            if (params.format) {
                tags.push({ name: "Format", value: params.format });
            }
            if (params.nonce) {
                tags.push({ name: "Nonce", value: params.nonce.toString() });
            }
            if (params.timestamp) {
                tags.push({ name: "Timestamp", value: params.timestamp.toString() });
            }

            const result = await this.dryrun(undefined, tags);
            return ResultUtils.getFirstMessageDataJson(result);
        } catch (error: any) {
            throw new ClientError(this, this.getDelegations, params, error);
        }
    }
    /* Core Functions */
}
