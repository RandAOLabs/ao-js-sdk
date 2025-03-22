import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class QArweave extends TokenClient {
    public static autoConfiguration(): QArweave {
        return QArweave.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<QArweave> {
        return new ClientBuilder(QArweave)
            .withProcessId(PROCESS_IDS.DEFI.WRAPPED_ARWEAVE)
    }
}