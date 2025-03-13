import { ReadOnlyAOClient } from "./ReadOnlyAOClient";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { AOSuspectedRateLimitingError } from "./AOError";
import { DryRunParams } from "./abstract";
import { ConnectArgsLegacy } from "./aoconnect-types";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { AOAllConfigsFailedError } from "src/core/ao/ao-client/AOClientError";

export class ReadOnlyRetryAOClient extends ReadOnlyAOClient {
    private static readonly AO_CONFIGURATIONS: readonly ConnectArgsLegacy[] = [
        AO_CONFIGURATIONS.FORWARD_RESEARCH,
        AO_CONFIGURATIONS.ARDRIVE,
        AO_CONFIGURATIONS.RANDAO,
        AO_CONFIGURATIONS.ARIO
    ] as const;

    private encounteredErrors: Error[] = [];

    private async tryWithConfig(configIndex: number, params: DryRunParams): Promise<DryRunResult> {
        const currentConfig = ReadOnlyRetryAOClient.AO_CONFIGURATIONS[configIndex];

        this.setConfig(currentConfig);
        return await super.dryrun(params);
    }

    public override async dryrun(params: DryRunParams): Promise<DryRunResult> {
        this.encounteredErrors = []; // Reset errors for new attempt

        // First try with the original config if it exists
        try {
            return await super.dryrun(params);
        } catch (error: any) {
            if (error instanceof AOSuspectedRateLimitingError) {
                this.encounteredErrors.push(error);
            } else {
                // If it's not a rate limiting error, throw it immediately
                throw error;
            }
        }

        // If original config failed with rate limiting, try each alternative config in sequence
        for (let configIndex = 0; configIndex < ReadOnlyRetryAOClient.AO_CONFIGURATIONS.length; configIndex++) {
            try {
                return await this.tryWithConfig(configIndex, params);
            } catch (error: any) {
                if (error instanceof AOSuspectedRateLimitingError) {
                    this.encounteredErrors.push(error);
                } else {
                    // If it's not a rate limiting error, throw it immediately
                    throw error;
                }
            }
        }

        // If we get here, all compute units failed
        throw new AOAllConfigsFailedError(params, this.encounteredErrors);
    }

    constructor(aoConfig?: ConnectArgsLegacy) {
        super(aoConfig);
    }
}
