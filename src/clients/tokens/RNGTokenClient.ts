import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { AO_CONFIGURATIONS } from "../../core/ao/ao-client/configurations";
import { PROCESS_IDS } from "../../constants/processIds";
import { IAutoconfiguration, IDefaultBuilder } from "../../utils/class-interfaces";
import { staticImplements } from "../../utils/decorators";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class RNGToken extends TokenClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): RNGToken {
		return RNGToken.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<RNGToken> {
		return new ClientBuilder(RNGToken)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.withProcessId(PROCESS_IDS.RANDAO.RNG_TOKEN)
	}
}
