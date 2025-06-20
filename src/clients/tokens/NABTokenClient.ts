import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../processes/ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class NABToken extends TokenClient {
	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static autoConfiguration(): NABToken {
		return NABToken.defaultBuilder()
			.build()
	}

	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static defaultBuilder(): ClientBuilder<NABToken> {
		return new ClientBuilder(NABToken)
			.withProcessId(PROCESS_IDS.AO)
	}
}
