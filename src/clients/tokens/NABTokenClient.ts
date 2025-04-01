import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
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