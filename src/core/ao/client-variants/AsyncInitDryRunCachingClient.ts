import { IAsyncAutoConfiguration } from "src/core/ao/abstract/IAsyncAutoConfiguration";
import { DryRunCachingClient } from "src/core/ao/client-variants/DryRunCachingClient";
import { getDryRunCachineClientAutoConfiguration } from "src/core/ao/client-variants/DryRunCachingClientAutoConfiguration";

/**
 * @category Core
 */
export class AsyncInitDryRunCachingClient extends DryRunCachingClient implements IAsyncAutoConfiguration {
    public static autoConfiguration(): Promise<AsyncInitDryRunCachingClient> {
        const config = getDryRunCachineClientAutoConfiguration()
        return Promise.resolve(new DryRunCachingClient(config))
    }
}