import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class WrappedArweave extends TokenClient {
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): WrappedArweave {
		return WrappedArweave.defaultBuilder()
			.build()
	}
	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static defaultBuilder(): ClientBuilder<WrappedArweave> {
		return new ClientBuilder(WrappedArweave)
			.withProcessId(PROCESS_IDS.DEFI.WRAPPED_ARWEAVE)
	}
}