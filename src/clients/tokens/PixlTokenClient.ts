import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { BAZAR } from "../../process-ids/bazar";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class PixlToken extends TokenClient {
	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static autoConfiguration(): PixlToken {
		return PixlToken.defaultBuilder()
			.build()
	}
	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static defaultBuilder(): ClientBuilder<PixlToken> {
		return new ClientBuilder(PixlToken)
			.withProcessId(BAZAR.PIXL_TOKEN)
	}
}
