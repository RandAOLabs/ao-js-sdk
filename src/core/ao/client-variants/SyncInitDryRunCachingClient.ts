import { ISyncAutoConfiguration } from "src/core/ao/abstract/ISyncAutoConfiguraiton";
import { DryRunCachingClient } from "src/core/ao/client-variants/DryRunCachingClient";
import { getDryRunCachineClientAutoConfiguration } from "src/core/ao/client-variants/DryRunCachingClientAutoConfiguration";

/**
 * @category Core
 */
export class SyncInitDryRunCachingClient extends DryRunCachingClient implements ISyncAutoConfiguration {
    public static autoConfiguration(): SyncInitDryRunCachingClient {
        const config = getDryRunCachineClientAutoConfiguration()
        return new DryRunCachingClient(config)
    }
}