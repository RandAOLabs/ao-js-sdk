import { InputValidationError } from "src/clients/bazar";
import { NftSaleClientConfig } from "src/clients/miscellaneous/nft-sale/abstract";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { IBuilder } from "src/utils/builder";

export class TokenInterfacingClientConfigBuilder extends BaseClientConfigBuilder implements IBuilder<NftSaleClientConfig> {
    private tokenProcessId?: string

    // ==========================================
    // Interface Methods (IBuilder)
    // ==========================================

    /**
     * Builds and returns the final DryRunCachingClientConfig object.
     * @returns The constructed DryRunCachingClientConfig
     */
    build(): NftSaleClientConfig {
        const baseConfig = super.build();//validation is called add superclass
        return {
            ...baseConfig,
            // Since cacheConfig is optional in DryRunCachingClientConfig,
            // we only include it if it's defined
            tokenProcessId: this.tokenProcessId!
        };
    }

    /**
     * Resets the builder to its initial state.
     * @returns The builder instance for method chaining
     */
    reset(): this {
        super.reset();
        this.tokenProcessId = undefined;
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
        super.validate();

        if (!this.tokenProcessId) {
            throw new InputValidationError('TokenProccessIdIsRequired');
        }
    }

    // ==========================================
    // Builder Configuration Methods
    // ==========================================

    /**
     * Sets the tokenProcessId.
     * @param tokenProcessId The tokenProcessId options
     * @returns The builder instance for method chaining
     */
    withTokenProcessId(tokenProcessId: string): this {
        this.tokenProcessId = tokenProcessId
        return this;
    }
}