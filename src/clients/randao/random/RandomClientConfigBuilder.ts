import { JWKInterface } from "arweave/node/lib/wallet";
import { InputValidationError } from "src/clients/bazar";
import { TokenInterfacingClientConfig } from "src/clients/common/TokenInterfacingClientConfig";
import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";
import { RandomClientConfig } from "src/clients/randao/random/abstract";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids";
import { ARIOService } from "src/services";
import { Domain } from "src/services/ario/domains";
import { getWalletLazy } from "src/utils";
import { IBuilder } from "src/utils/builder";

export class RandomClientConfigBuilder implements IBuilder<RandomClientConfig> {
    private config: Partial<RandomClientConfig> = {};
    private useDefaults: boolean = true;

    // ==========================================
    // Interface Methods (IBuilder)
    // ==========================================

    /**
     * Builds and returns the final BaseClientConfig object.
     * @returns The constructed BaseClientConfig
     * @throws Error if required fields are not set and defaults are not allowed
     */
    async build(): Promise<RandomClientConfig> {
        this.validate();

        // We can assert processId exists since validate() would throw if it didn't
        return {
            processId: this.config.processId || await ARIOService.getInstance().getProcessIdForDomain(Domain.RANDAO_API),
            tokenProcessId: this.config.tokenProcessId || RNG_TOKEN_PROCESS_ID,
            wallet: this.config.wallet || getWalletLazy()
        };
    }

    /**
     * Resets the builder to its initial state.
     * @returns The builder instance for method chaining
     */
    reset(): this {
        this.config = {};
        this.useDefaults = false;
        return this;
    }

    /**
     * Controls whether default values should be allowed during building.
     * @param allow If true, allows default values to be used for unset properties
     * @returns The builder instance for method chaining
     */
    allowDefaults(allow: boolean): this {
        this.useDefaults = allow;
        return this;
    }

    // ==========================================
    // Protected Methods
    // ==========================================

    /**
     * Validates the configuration based on whether defaults are allowed.
     * @throws Error if validation fails
     */
    protected validate(): void {
        if (!this.useDefaults && !this.config.processId) {
            throw new InputValidationError('Process ID is required');
        }

        if (!this.useDefaults && !this.config.wallet) {
            throw new InputValidationError('Wallet is required when defaults are not allowed');
        }
    }

    /**
     * Gets whether default values are allowed.
     * @returns True if defaults are allowed, false otherwise
     */
    protected isDefaultsAllowed(): boolean {
        return this.useDefaults;
    }

    // ==========================================
    // Builder Configuration Methods
    // ==========================================

    /**
     * Sets the process ID for the configuration.
     * @param processId The ID of the ao process
     * @returns The builder instance for method chaining
     */
    withProcessId(processId: string): this {
        this.config.processId = processId;
        return this;
    }

    /**
     * Sets the wallet for the configuration.
     * @param wallet The Arweave wallet interface
     * @returns The builder instance for method chaining
     */
    withWallet(wallet: JWKInterface): this {
        this.config.wallet = wallet;
        return this;
    }
}