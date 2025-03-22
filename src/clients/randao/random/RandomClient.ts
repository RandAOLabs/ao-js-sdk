import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { TokenClient, TokenClientConfig } from "src/clients/ao";
import { POST_VDF_OUTPUT_AND_PROOF_TAG } from "./constants";
import { IRandomClient, RandomClientConfig, GetProviderAvailableValuesResponse, GetOpenRandomRequestsResponse, GetRandomRequestsResponse, ProviderActivity } from "src/clients/randao/random/abstract";
import { PostVDFChallengeError, ProviderAvailableValuesError, UpdateProviderAvailableValuesError, OpenRandomRequestsError, RandomRequestsError, CreateRequestError, PostVDFOutputAndProofError, GetAllProviderActivityError, GetProviderActivityError } from "src/clients/randao/random/RandomClientError";
import { RandomProcessError } from "src/clients/randao/random/RandomProcessError";
import { Tags } from "src/core";
import { BaseClient } from "src/core/ao/BaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "src/utils";
import { ARIOService } from "src/services";
import { TokenInterfacingClientBuilder } from "src/clients/common/TokenInterfacingClientBuilder";
import { Domain } from "src/services/ario/domains";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { PROCESS_IDS } from "src/process-ids";

/**
 * @category RandAO
 * @see {@link https://github.com/RandAOLabs/Random-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
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

    public static async defaultBuilder(): Promise<TokenInterfacingClientBuilder<RandomClient>> {
        const ario = await ARIOService.getInstance()
        const randomProcessId = await ario.getProcessIdForDomain(Domain.RANDAO_API)
        return new TokenInterfacingClientBuilder(RandomClient)
            .withProcessId(randomProcessId)
            .withTokenProcessId(PROCESS_IDS.RANDAO.RANDOM)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO)
    }
    /* Constructors */

    /* Core Random Functions */
    async postVDFChallenge(randomnessRequestId: string, modulus: string, input: string): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Post-VDF-Challenge" },
            ];
            const data = JSON.stringify({ requestId: randomnessRequestId, input, modulus });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            Logger.error(`Error posting VDF challenge: ${error.message}`);
            throw new PostVDFChallengeError(error);
        }
    }

    async getProviderAvailableValues(providerId: string): Promise<GetProviderAvailableValuesResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Providers-Random-Balance" },
            ];
            const data = JSON.stringify({ providerId });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return await ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error retrieving provider's available values: ${error.message}`);
            throw new ProviderAvailableValuesError(error);
        }
    }

    async updateProviderAvailableValues(availableRandomValues: number): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Update-Providers-Random-Balance" },
            ];
            const data = JSON.stringify({ availableRandomValues });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            Logger.error(`Error updating provider's available values: ${error.message}`);
            throw new UpdateProviderAvailableValuesError(error);
        }
    }

    async getOpenRandomRequests(provider: string): Promise<GetOpenRandomRequestsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Open-Random-Requests" },
            ];
            const data = JSON.stringify({ providerId: provider });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error retrieving open random requests: ${error.message}`);
            throw new OpenRandomRequestsError(error);
        }
    }

    async getRandomRequests(randomnessRequestIds: string[]): Promise<GetRandomRequestsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Random-Requests" },
            ];
            const data = JSON.stringify({ requestIds: randomnessRequestIds });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error retrieving random requests: ${error.message}`);
            throw new RandomRequestsError(error);
        }
    }

    async getRandomRequestViaCallbackId(callbackId: string): Promise<GetRandomRequestsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Random-Request-Via-Callback-Id" },
            ];
            const data = JSON.stringify({ callbackId });
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error retrieving random request via callback ID: ${error.message}`);
            throw new RandomRequestsError(error);
        }
    }

    async createRequest(provider_ids: string[], requestedInputs?: number, callbackId: string = ''): Promise<boolean> {
        try {
            const paymentAmount = "100"; // TODO: Determine payment amount dynamically if needed
            const tags = [
                { name: "Providers", value: JSON.stringify({ provider_ids }) },
                { name: "CallbackId", value: callbackId },
            ];

            if (requestedInputs !== undefined) {
                tags.push({ name: "RequestedInputs", value: JSON.stringify({ requested_inputs: requestedInputs }) });
            }

            return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
        } catch (error: any) {
            Logger.error(`Error creating request: ${error.message}`);
            throw new CreateRequestError(error);
        }
    }


    async postVDFOutputAndProof(randomnessRequestId: string, output: string, proof: string): Promise<boolean> {
        try {
            const tags: Tags = [
                POST_VDF_OUTPUT_AND_PROOF_TAG,
            ];
            const data = JSON.stringify({ requestId: randomnessRequestId, output, proof });
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            Logger.error(`Error posting VDF output and proof: ${error.message}`);
            throw new PostVDFOutputAndProofError(error);
        }
    }

    async getAllProviderActivity(): Promise<ProviderActivity[]> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-All-Providers" },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error Getting all provider activity: ${error.message}`);
            throw new GetAllProviderActivityError(error);
        }
    }

    async getProviderActivity(providerId: String): Promise<ProviderActivity> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Get-Provider" },
            ];
            const data = JSON.stringify({ providerId: providerId })
            const result = await this.dryrun(data, tags);
            this.checkResultForErrors(result)
            return ResultUtils.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error getting provider activity: ${error.message}`);
            throw new GetProviderActivityError(error);
        }
    }

    /* Core Random Functions */

    /* Utilities */
    private checkResultForErrors(result: MessageResult | DryRunResult) {
        for (let msg of result.Messages) {
            const tags: Tags = msg.Tags;
            for (let tag of tags) {
                if (tag.name == "Error") {
                    throw new RandomProcessError(`Error originating in process: ${this.getProcessId()}`)
                }
            }
        }
    }
    /* Utilities */
}
