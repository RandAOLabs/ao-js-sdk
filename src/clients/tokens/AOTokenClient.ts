import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";

/**
 * Client for interacting with AO tokens on the network.
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class AOToken extends TokenClient {
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): AOToken {
		return AOToken.defaultBuilder()
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static defaultBuilder(): ClientBuilder<AOToken> {
		return new ClientBuilder(AOToken)
			.withProcessId(PROCESS_IDS.AO)
	}
}
