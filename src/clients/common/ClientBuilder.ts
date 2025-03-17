import { BaseClientConfig, BaseClientConfigBuilder } from "src/core";
import { BaseClient } from "src/core/ao/BaseClient";
import { IBuilder } from "src/abstract/IBuilder";

export class ClientBuilder<T extends BaseClient> implements IBuilder<T> {
    private configBuilder: BaseClientConfigBuilder;
    private clientConstructor: new (config: BaseClientConfig) => T;

    constructor(clientConstructor: new (config: BaseClientConfig) => T) {
        this.clientConstructor = clientConstructor;
        this.configBuilder = new BaseClientConfigBuilder();
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
}
