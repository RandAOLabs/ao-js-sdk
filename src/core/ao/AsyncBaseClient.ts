import { IAsyncAutoConfiguration } from "src/core/ao/abstract/IAsyncAutoConfiguration";
import { BaseClient } from "src/core/ao/BaseClient";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

export class ASyncBaseClient extends BaseClient implements IAsyncAutoConfiguration {
    public static autoConfiguration(): Promise<ASyncBaseClient> {
        const config = getBaseClientAutoConfiguration()
        return Promise.resolve(new BaseClient(config))
    }
}