import { BaseClient } from "src/core/ao/BaseClient";
import { IBuilder } from "src/utils/class-interfaces/IBuilder";
import { TokenInterfacingClientConfig } from "./TokenInterfacingClientConfig";
import { TokenInterfacingClientConfigBuilder } from ".";

export class TokenInterfacingClientBuilder<T extends BaseClient> implements IBuilder<T> {
    private configBuilder: TokenInterfacingClientConfigBuilder;
    private clientConstructor: new (config: TokenInterfacingClientConfig) => T;

    constructor(clientConstructor: new (config: TokenInterfacingClientConfig) => T) {
        this.clientConstructor = clientConstructor;
        this.configBuilder = new TokenInterfacingClientConfigBuilder();
    }

    build(): T {
        const config = this.configBuilder.build();
        return new this.clientConstructor(config);
    }

    reset(): this {
        this.configBuilder.reset();
        return this;
    }

    allowDefaults(allow: boolean): this {
        this.configBuilder.allowDefaults(allow);
        return this;
    }

    withProcessId(processId: string): this {
        this.configBuilder.withProcessId(processId);
        return this;
    }

    withWallet(wallet: any): this {
        this.configBuilder.withWallet(wallet);
        return this;
    }

    withAOConfig(aoConfig: any): this {
        this.configBuilder.withAOConfig(aoConfig);
        return this;
    }

    withTokenProcessId(processId: string): this {
        this.configBuilder.withTokenProcessId(processId)
        return this
    }
}
