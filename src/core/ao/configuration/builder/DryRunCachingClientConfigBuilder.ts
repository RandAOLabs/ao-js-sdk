import { ICacheConfig } from '../../../../utils/cache/abstract/ICacheConfig';
import { BaseClientConfigBuilder } from './BaseClientConfigBuilder';
import { DryRunCachingClientConfig } from '../DryRunCachingConfig';

/**
 * Builder class for constructing DryRunCachingClientConfig objects.
 * Extends BaseClientConfigBuilder to include caching configuration options.
 */
export class DryRunCachingClientConfigBuilder extends BaseClientConfigBuilder {
    private cacheConfig?: Partial<ICacheConfig>;

    // ==========================================
    // Interface Methods (IBuilder)
    // ==========================================

    /**
     * Builds and returns the final DryRunCachingClientConfig object.
     * @returns The constructed DryRunCachingClientConfig
     */
    build(): DryRunCachingClientConfig {
        const baseConfig = super.build();
        return {
            ...baseConfig,
            // Since cacheConfig is optional in DryRunCachingClientConfig,
            // we only include it if it's defined
            ...(this.cacheConfig && { cacheConfig: this.cacheConfig })
        };
    }

    /**
     * Resets the builder to its initial state.
     * @returns The builder instance for method chaining
     */
    reset(): this {
        super.reset();
        this.cacheConfig = undefined;
        return this;
    }

    // ==========================================
    // Protected Methods
    // ==========================================

    /**
     * Validates the configuration based on whether defaults are allowed.
     * Extends base validation to include cache config validation.
     * @throws Error if validation fails
     */
    protected validate(): void {
        super.validate();

        // If defaults are not allowed, cacheConfig must be provided
        if (!this.isDefaultsAllowed() && !this.cacheConfig) {
            throw new Error('Cache configuration is required when defaults are not allowed');
        }
    }

    // ==========================================
    // Builder Configuration Methods
    // ==========================================

    /**
     * Sets the cache configuration options.
     * @param config The cache configuration options
     * @returns The builder instance for method chaining
     */
    withCacheConfig(config: ICacheConfig): this {
        this.cacheConfig = { ...config };
        return this;
    }
}
