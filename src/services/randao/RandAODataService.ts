import { IAutoconfiguration, Logger } from "../../utils";
import { staticImplements } from "../../utils/decorators";
import { ARIOService, IARIOService } from "../ario";
import { DOMAIN } from "../ario/domains";
import { IMessagesService, MessagesService } from "../messages";
import { IRandAODataService } from "./abstract/IRandAODataService";
import RANDOM_PROCESS_TAGS from "../../clients/randao/random/tags";
import { SYSTEM_TAGS } from "../../core/common/tags";


/**
 * Service for handling RandAO operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAODataService implements IRandAODataService {
	constructor(
		private readonly arioservice: IARIOService,
		private readonly messagesService: IMessagesService,
	) { }

	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static async autoConfiguration(): Promise<IRandAODataService> {
		return new RandAODataService(
			ARIOService.getInstance(),
			MessagesService.autoConfiguration(),
		);
	}

	async getTotalRandomResponses(): Promise<number> {
		const randomProcessId = await this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API)
		Logger.debug(randomProcessId)
		return await this.messagesService.countAllMessages({
			tags: [
				RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
				SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
			]
		})
	}

	async getProviderTotalFullfilledCount(providerId: string): Promise<number> {
		const randomProcessId = await this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API)
		return this.messagesService.countAllMessages({
			owner: providerId,
			recipient: randomProcessId,
			tags: [RANDOM_PROCESS_TAGS.ACTION.REVEAL]
		});
	}

}
