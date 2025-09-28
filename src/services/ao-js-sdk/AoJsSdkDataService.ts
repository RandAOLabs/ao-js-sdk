import { IArweaveDataService, ArweaveGQLBuilder } from "../../core";
import { ArweaveDataCachingService } from "../../core/arweave/ArweaveDataCachingService";
import { staticImplements, IAutoconfiguration, ServiceErrorHandler } from "../../utils";
import { DEFAULT_TAGS } from "../../core/ao/constants";
import { IAoJsSdkDataService } from "./abstract";

/**
 * @category Service
 */
@staticImplements<IAutoconfiguration>()
export class AoJsSdkDataService implements IAoJsSdkDataService {
	private constructor(
		private readonly arweaveDataService: IArweaveDataService
	) { }

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): IAoJsSdkDataService {
		return new AoJsSdkDataService(
			ArweaveDataCachingService.autoConfiguration()
		);
	}

	/**
	 * {@inheritdoc IAoJsSdkDataService.getTotalAoJsMessages}
	 * @see {@link IAoJsSdkDataService.getTotalAoJsMessages}
	 */
	@ServiceErrorHandler
	public async getTotalAoJsMessages(): Promise<string> {
		const builder = new ArweaveGQLBuilder()
			.tags(DEFAULT_TAGS)
			.count();

		const response = await this.arweaveDataService.query(builder);
		return response.data.transactions.count! as string;
	}
}
