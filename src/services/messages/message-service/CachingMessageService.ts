import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { ArweaveGQLBuilder } from "../../../core";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IMessagesService, GetLatestMessagesParams, GetLatestMessagesResponse, GetLatestMessagesBySenderParams, GetLatestMessagesByRecipientParams, GetAllMessagesParams, GetAllMessagesBySenderParams, GetAllMessagesByRecipientParams } from "./abstract";
import { ArweaveDataCachingService } from "../../../core/arweave/ArweaveDataCachingService";
import { MessagesService } from "./MessagesService";

/**
 * @category On-chain-data
 */
@staticImplements<IAutoconfiguration>()
export class CachingMessageService implements IMessagesService {
	private readonly messagesService: IMessagesService;

	private constructor(messagesService: IMessagesService) {
		this.messagesService = messagesService;
	}

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): IMessagesService {
		const cachingArweaveDataService = ArweaveDataCachingService.autoConfiguration();
		const messagesService = MessagesService.withArweaveDataService(cachingArweaveDataService);
		return new CachingMessageService(messagesService);
	}

	public async getLatestMessages(params?: GetLatestMessagesParams): Promise<GetLatestMessagesResponse> {
		return this.messagesService.getLatestMessages(params);
	}

	public async getLatestMessagesSentBy(params: GetLatestMessagesBySenderParams): Promise<GetLatestMessagesResponse> {
		return this.messagesService.getLatestMessagesSentBy(params);
	}

	public async getLatestMessagesReceivedBy(params: GetLatestMessagesByRecipientParams): Promise<GetLatestMessagesResponse> {
		return this.messagesService.getLatestMessagesReceivedBy(params);
	}

	public async getAllMessages(params?: GetAllMessagesParams): Promise<ArweaveTransaction[]> {
		return this.messagesService.getAllMessages(params);
	}

	public async getAllMessagesSentBy(params: GetAllMessagesBySenderParams): Promise<ArweaveTransaction[]> {
		return this.messagesService.getAllMessagesSentBy(params);
	}

	public async getAllMessagesReceivedBy(params: GetAllMessagesByRecipientParams): Promise<ArweaveTransaction[]> {
		return this.messagesService.getAllMessagesReceivedBy(params);
	}

	public async countAllMessages(params: GetAllMessagesParams): Promise<number> {
		return this.messagesService.countAllMessages(params);
	}

	public async getMessageById(id: string): Promise<ArweaveTransaction | undefined> {
		return this.messagesService.getMessageById(id);
	}

	public async getAllMessagesWithBuilder(builder: ArweaveGQLBuilder): Promise<ArweaveTransaction[]> {
		return this.messagesService.getAllMessagesWithBuilder(builder);
	}
}
