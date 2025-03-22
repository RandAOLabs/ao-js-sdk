import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";

/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class AOToken extends TokenClient {
    public static autoConfiguration(): AOToken {
        return AOToken.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<AOToken> {
        return new ClientBuilder(AOToken)
            .withProcessId(PROCESS_IDS.AO)
    }
}