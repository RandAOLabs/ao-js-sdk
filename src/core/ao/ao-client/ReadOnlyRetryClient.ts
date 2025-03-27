import { ReadOnlyAOClient } from "./ReadOnlyAOClient";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { DryRunParams } from "./abstract";
import { ConnectArgsLegacy } from "./aoconnect-types";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { AOAllConfigsFailedError, AORateLimitingError } from "src/core/ao/ao-client/AOClientError";
import { MessageResult, ReadResultArgs } from "@permaweb/aoconnect/dist/lib/result";
import { ReadResultsArgs, ResultsResponse } from "@permaweb/aoconnect/dist/lib/results";

export class ReadOnlyRetryAOClient extends ReadOnlyAOClient {
    private static readonly AO_CONFIGURATIONS: readonly ConnectArgsLegacy[] = [
        AO_CONFIGURATIONS.RANDAO,
        AO_CONFIGURATIONS.ARDRIVE,
        AO_CONFIGURATIONS.ARIO,
        AO_CONFIGURATIONS.FORWARD_RESEARCH,
    ] as const;

    private encounteredErrors: Error[] = [];

    constructor(aoConfig?: ConnectArgsLegacy) {
        super(aoConfig);
    }

    public override async dryrun(params: DryRunParams): Promise<DryRunResult> {
        return this.retryWithConfigs<DryRunResult, DryRunParams>(
            params,
            () => super.dryrun(params),
            (p) => super.dryrun(p)
        );
    }

    public override async result(params: ReadResultArgs): Promise<MessageResult> {
        return this.retryWithConfigs<MessageResult, ReadResultArgs>(
            params,
            () => super.result(params),
            (p) => super.result(p)
        );
    }

    public override async results(params: ReadResultsArgs): Promise<ResultsResponse> {
        return this.retryWithConfigs<ResultsResponse, ReadResultsArgs>(
            params,
            () => super.results(params),
            (p) => super.results(p)
        );
    }

    /**
     * Generic method to try an operation with a specific configuration
     * @param configIndex The index of the configuration to use
     * @param operation The operation to perform with the configuration
     * @returns The result of the operation
     */
    private async tryWithConfig<T>(
        configIndex: number,
        operation: () => Promise<T>
    ): Promise<T> {
        const currentConfig = ReadOnlyRetryAOClient.AO_CONFIGURATIONS[configIndex];
        this.setConfig(currentConfig);
        return await operation();
    }

    /**
     * Generic method to retry an operation with different configurations if rate limiting is encountered
     * @param params The parameters for the operation
     * @param initialOperation The operation to try with the initial configuration
     * @param operationFn Function to create an operation for a specific configuration
     * @returns The result of the successful operation
     * @throws AOAllConfigsFailedError if all configurations fail
     */
    private async retryWithConfigs<T, P>(
        params: P,
        initialOperation: () => Promise<T>,
        operationFn: (params: P) => Promise<T>
    ): Promise<T> {
        this.encounteredErrors = []; // Reset errors for new attempt

        // First try with the original config if it exists
        try {
            return await initialOperation();
        } catch (error: any) {
            if (error instanceof AORateLimitingError) {
                this.encounteredErrors.push(error);
            } else {
                // If it's not a rate limiting error, throw it immediately
                throw error;
            }
        }

        // If original config failed with rate limiting, try each alternative config in sequence
        for (let configIndex = 0; configIndex < ReadOnlyRetryAOClient.AO_CONFIGURATIONS.length; configIndex++) {
            try {
                return await this.tryWithConfig(configIndex, () => operationFn(params));
            } catch (error: any) {
                if (error instanceof AORateLimitingError) {
                    this.encounteredErrors.push(error);
                } else {
                    // If it's not a rate limiting error, throw it immediately
                    throw error;
                }
            }
        }

        // If we get here, all compute units failed
        throw new AOAllConfigsFailedError(this, this.retryWithConfigs, { params, initialOperation, operationFn }, this.encounteredErrors, await this.getCallingWalletAddress())
    }
}
