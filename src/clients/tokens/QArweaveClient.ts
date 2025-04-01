import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";
import { PROCESS_IDS } from "../../process-ids";
import { staticImplements, IAutoconfiguration, IDefaultBuilder } from "../../utils";
/**
 * @category Tokens
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class QArweave extends TokenClient {
	/** {@inheritDoc IAutoconfiguration.autoConfiguration} */
	public static autoConfiguration(): QArweave {
		return QArweave.defaultBuilder()
			.build()
	}

	/** {@inheritDoc IDefaultBuilder.defaultBuilder} */
	public static defaultBuilder(): ClientBuilder<QArweave> {
		return new ClientBuilder(QArweave)
			.withProcessId(PROCESS_IDS.DEFI.WRAPPED_ARWEAVE)
	}
}
