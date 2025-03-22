import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class TrunkToken extends TokenClient {
    public static autoConfiguration(): TrunkToken {
        return TrunkToken.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<TrunkToken> {
        return new ClientBuilder(TrunkToken)
            .withProcessId(PROCESS_IDS.COMMUNITY_TOKENS.TRUNK)
    }
}