import { ISyncAutoConfiguration } from "src/core/ao/abstract/ISyncAutoConfiguraiton";
import { DryRunCachingClient } from "src/core/ao/client-variants/DryRunCachingClient";
import { UnimplementedError } from "src/utils/errors";

/**
 * @category Core
 */
export class SyncInitDryRunCachingClient extends DryRunCachingClient implements ISyncAutoConfiguration {
    public static autoConfiguration(): SyncInitDryRunCachingClient {
        throw new UnimplementedError('autoConfiguration', this.name)
    }
}
