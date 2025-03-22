import { TokenClient } from "src/clients/ao";
import { ClientBuilder } from "src/clients/common";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { PROCESS_IDS } from "src/process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "src/utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class RNGToken extends TokenClient {
    public static autoConfiguration(): RNGToken {
        return RNGToken.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<RNGToken> {
        return new ClientBuilder(RNGToken)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO)
            .withProcessId(PROCESS_IDS.RANDAO.RNG_TOKEN)
    }
}