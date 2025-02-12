import { ISyncAutoConfiguration } from "src/core/ao/abstract/ISyncAutoConfiguraiton";
import { BaseClient } from "src/core/ao/BaseClient";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

export class SyncBaseClient extends BaseClient implements ISyncAutoConfiguration {
    public static autoConfiguration(): SyncBaseClient {
        const config = getBaseClientAutoConfiguration()
        return new BaseClient(config)
    }
}