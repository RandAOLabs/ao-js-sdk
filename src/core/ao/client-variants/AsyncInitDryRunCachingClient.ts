import { IAsyncAutoConfiguration } from "src/core/ao/abstract/IAsyncAutoConfiguration";
import { DryRunCachingClient } from "src/core/ao/client-variants/DryRunCachingClient";
import { UnimplementedError } from "src/utils/errors";

/**
 * @category Core
 */
export class AsyncInitDryRunCachingClient extends DryRunCachingClient implements IAsyncAutoConfiguration {
    public static autoConfiguration(): Promise<AsyncInitDryRunCachingClient> {
        throw new UnimplementedError('autoConfiguration', this.name)
    }
}