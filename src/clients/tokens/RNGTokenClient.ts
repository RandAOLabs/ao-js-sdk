import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { AO_CONFIGURATIONS } from "../../core/ao/ao-client/configurations";
import { PROCESS_IDS } from "../../process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class RNGToken extends TokenClient {
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): RNGToken {
		return RNGToken.defaultBuilder()
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static defaultBuilder(): ClientBuilder<RNGToken> {
		return new ClientBuilder(RNGToken)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.withProcessId(PROCESS_IDS.RANDAO.RNG_TOKEN)
	}
}
