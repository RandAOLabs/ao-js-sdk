import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../constants/processIds";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";

/**
 * Client for interacting with SEND token.
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class SendToken extends TokenClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): SendToken {
		return SendToken.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<SendToken> {
		return new ClientBuilder(SendToken)
			.withProcessId(PROCESS_IDS.COMMUNITY_TOKENS.SEND)
	}
}
