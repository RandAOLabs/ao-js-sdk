import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { COMMUNITY_TOKENS } from "../../constants/processIds/community_tokens";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class DumDumToken extends TokenClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): DumDumToken {
		return DumDumToken.defaultBuilder()
			.build()
	}
	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<DumDumToken> {
		return new ClientBuilder(DumDumToken)
			.withProcessId(COMMUNITY_TOKENS.DUMDUM)
	}
}
