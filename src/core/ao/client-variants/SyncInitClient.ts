import { ISyncAutoConfiguration } from "src/core/ao/abstract/ISyncAutoConfiguraiton";
import { BaseClient } from "src/core/ao/BaseClient";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

/**
 * @category Core
 */
export class SyncInitClient extends BaseClient implements ISyncAutoConfiguration {
    public static autoConfiguration(): SyncInitClient {
        const config = getBaseClientAutoConfiguration()
        return new BaseClient(config)
    }
}