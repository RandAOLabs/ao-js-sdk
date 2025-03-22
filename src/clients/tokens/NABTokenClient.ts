import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class NABToken extends TokenClient {
    public static autoConfiguration(): NABToken {
        return NABToken.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<NABToken> {
        return new ClientBuilder(NABToken)
            .withProcessId(PROCESS_IDS.AO)
    }
}