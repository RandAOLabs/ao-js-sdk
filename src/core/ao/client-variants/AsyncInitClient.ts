import { IAsyncAutoConfiguration } from "src/core/ao/abstract/IAsyncAutoConfiguration";
import { BaseClient } from "src/core/ao/BaseClient";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

/**
 * @category Core
 */
export class ASyncInitClient extends BaseClient implements IAsyncAutoConfiguration {
    public static autoConfiguration(): Promise<ASyncInitClient> {
        const config = getBaseClientAutoConfiguration()
        return Promise.resolve(new BaseClient(config))
    }
}