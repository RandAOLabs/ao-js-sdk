import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { TokenClient, TokenClientConfig } from "src/clients/ao";
import { IRandomClient, RandomClientConfig, GetProviderAvailableValuesResponse, GetOpenRandomRequestsResponse, GetRandomRequestsResponse, ProviderActivity, CommitParams, RevealParams } from "src/clients/randao/random/abstract";
import { Tags } from "src/core";
import { BaseClient } from "src/core/ao/BaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "src/utils";
import { ARIOService } from "src/services";
import { TokenInterfacingClientBuilder } from "src/clients/common/TokenInterfacingClientBuilder";
import { Domain } from "src/services/ario/domains";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { PROCESS_IDS } from "src/process-ids";
import { ClientError } from "src/clients/common/ClientError";
import TAGS from "src/clients/randao/random/tags";
import { RandomProcessError } from "src/clients/randao/random/RandomProcessError";
import { IClassBuilder } from "src/utils/class-interfaces/IClientBuilder";

/**
 * @category RandAO
 * @see {@link https://github.com/RandAOLabs/Random-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()
export class RandomClient extends BaseClient implements IRandomClient {
    /* Fields */
    readonly tokenClient: TokenClient;
    /* Fields */

    /* Constructors */
    /**
     * @override
     */
    public constructor(randomConfig: RandomClientConfig) {
        super(randomConfig)
        const tokenConfig: TokenClientConfig = {
            processId: randomConfig.tokenProcessId,
            wallet: randomConfig.wallet
        }
        this.tokenClient = new TokenClient(tokenConfig)
    }

    public static async autoConfiguration(): Promise<RandomClient> {
        const builder = await RandomClient.defaultBuilder()
        return builder
            .build()
    }

    public static builder(): TokenInterfacingClientBuilder<RandomClient> {
        return new TokenInterfacingClientBuilder(RandomClient)
    }

    public static async defaultBuilder(): Promise<TokenInterfacingClientBuilder<RandomClient>> {
        const ario = await ARIOService.getInstance()
        const randomProcessId = await ario.getProcessIdForDomain(Domain.RANDAO_API)
        return RandomClient.builder()
            .withProcessId(randomProcessId)
            .withTokenProcessId(PROCESS_IDS.RANDAO.RNG_TOKEN)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO)
    }
    /* Constructors */

    /* Core Random Functions */
    async commit(params: CommitParams): Promise<void> {
        try {
            const tags: Tags = [
                TAGS.ACTION.COMMIT
            ];
            const data = JSON.stringify(params);
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
        } catch (error: any) {
            throw new ClientError(this, this.commit, params, error);
        }
    }
    async reveal(params: RevealParams): Promise<void> {
        try {
            const tags: Tags = [
                TAGS.ACTION.REVEAL
            ];
            const data = JSON.stringify(params);
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
        } catch (error: any) {
            throw new ClientError(this, this.reveal, params, error);
        }
    }

    async postVDFChallenge(randomnessRequestId: string, modulus: string, input: string): Promise<boolean> {
        try {
            const tags: Tags = [
                TAGS.ACTION.POST_VDF_CHALLENGE
            ];
            const data = JSON.stringify({ requestId: randomnessRequestId, input, modulus });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            throw new ClientError(this, this.postVDFChallenge, { randomnessRequestId, modulus, input }, error);
        }
    }

    async getProviderAvailableValues(providerId: string): Promise<GetProviderAvailableValuesResponse> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_PROVIDER_RANDOM_BALANCE
            ];
            const data = JSON.stringify({ providerId });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return await ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getProviderAvailableValues, { providerId }, error);
        }
    }

    async updateProviderAvailableValues(availableRandomValues: number): Promise<boolean> {
        try {
            const tags: Tags = [
                TAGS.ACTION.UPDATE_PROVIDER_RANDOM_BALANCE
            ];
            const data = JSON.stringify({ availableRandomValues });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            throw new ClientError(this, this.updateProviderAvailableValues, { availableRandomValues }, error);
        }
    }

    async getOpenRandomRequests(provider: string): Promise<GetOpenRandomRequestsResponse> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_OPEN_RANDOM_REQUESTS
            ];
            const data = JSON.stringify({ providerId: provider });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getOpenRandomRequests, { provider }, error);
        }
    }

    async getRandomRequests(randomnessRequestIds: string[]): Promise<GetRandomRequestsResponse> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_RANDOM_REQUESTS
            ];
            const data = JSON.stringify({ requestIds: randomnessRequestIds });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getRandomRequests, { randomnessRequestIds }, error);
        }
    }

    async getRandomRequestViaCallbackId(callbackId: string): Promise<GetRandomRequestsResponse> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_RANDOM_REQUEST_VIA_CALLBACK_ID
            ];
            const data = JSON.stringify({ callbackId });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getRandomRequestViaCallbackId, { callbackId }, error);
        }
    }

    async createRequest(provider_ids: string[], requestedInputs?: number, callbackId: string = ''): Promise<boolean> {
        try {
            const paymentAmount = "100"; // TODO: Determine payment amount dynamically if needed
            const tags: Tags = [
                { name: "Providers", value: JSON.stringify({ provider_ids }) },
                { name: "CallbackId", value: callbackId },
            ];

            if (requestedInputs !== undefined) {
                tags.push({ name: "RequestedInputs", value: JSON.stringify({ requested_inputs: requestedInputs }) });
            }

            return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
        } catch (error: any) {
            throw new ClientError(this, this.createRequest, { provider_ids, requestedInputs, callbackId }, error);
        }
    }


    async postVDFOutputAndProof(randomnessRequestId: string, output: string, proof: string): Promise<boolean> {
        try {
            const tags: Tags = [
                TAGS.ACTION.POST_VDF_OUTPUT_AND_PROOF
            ];
            const data = JSON.stringify({ requestId: randomnessRequestId, output, proof });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            throw new ClientError(this, this.postVDFOutputAndProof, { randomnessRequestId, output, proof }, error);
        }
    }

    async getAllProviderActivity(): Promise<ProviderActivity[]> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_ALL_PROVIDERS
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getAllProviderActivity, null, error);
        }
    }

    async getProviderActivity(providerId: String): Promise<ProviderActivity> {
        try {
            const tags: Tags = [
                TAGS.ACTION.GET_PROVIDER
            ];
            const data = JSON.stringify({ providerId: providerId })
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            throw new ClientError(this, this.getAllProviderActivity, { providerId }, error);
        }
    }

    /* Core Random Functions */

    /* Utilities */
    private checkResultForErrors(result: MessageResult | DryRunResult) {
        if (result.Messages) {
            for (let msg of result.Messages) {
                const tags: Tags = msg.Tags;
                for (let tag of tags) {
                    if (tag.name == "Error") {
                        throw new RandomProcessError(`Error originating in process: ${this.getProcessId()}`)
                    }
                }
            }
        }
    }
    /* Utilities */
}
