import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class WrappedArweave extends TokenClient {
    public static autoConfiguration(): WrappedArweave {
        return WrappedArweave.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<WrappedArweave> {
        return new ClientBuilder(WrappedArweave)
            .withProcessId(PROCESS_IDS.DEFI.WRAPPED_ARWEAVE)
    }
}