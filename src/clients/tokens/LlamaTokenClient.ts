import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { COMMUNITY_TOKENS } from "../../processes/ids/community_tokens";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class LlamaToken extends TokenClient {
	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static autoConfiguration(): LlamaToken {
		return LlamaToken.defaultBuilder()
			.build()
	}
	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static defaultBuilder(): ClientBuilder<LlamaToken> {
		return new ClientBuilder(LlamaToken)
			.withProcessId(COMMUNITY_TOKENS.LLAMA)
	}
}
