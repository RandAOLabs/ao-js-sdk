import { BaseClient } from "src/core/ao/BaseClient";
import { BaseClientConfig, BaseClientConfigBuilder } from "src/core/ao/configuration";
import { getWalletSafely } from "src/utils";
import { UnimplementedError } from "src/utils/errors";

export class SyncAutoConfigBaseClient extends BaseClient {

    /**
     * Creates a pre-configured instance of the client using the most recent process IDs.
     * This is the recommended way to instantiate the client for most use cases.
     * 
     * @returns A configured instance of the client ready for use
     * @throws Error if the implementation does not provide auto-configuration
     */
    public static autoConfiguration<T extends SyncAutoConfigBaseClient>(
        this: (new (config: BaseClientConfig) => T) & {
            defaultConfigBuilder: () => BaseClientConfigBuilder
        }
    ): T {
        const wallet = getWalletSafely()
        const config = this.defaultConfigBuilder()
            .withWallet(wallet)
            .build()
        return new this(config)
    }

    /**
     * Used to obtain a default {@link BaseClientConfigBuilder} likely coming with useful default values for process ids and alike.
     * @returns the default configuration builder for this client.
     */
    public static defaultConfigBuilder(): BaseClientConfigBuilder {
        throw new UnimplementedError('defaultConfigBuilder', this.name)
    }

}
