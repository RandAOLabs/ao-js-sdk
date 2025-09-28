import { IArweaveDataService, ArweaveDataService, ArweaveGQLBuilder, ArweaveGQLSortOrder } from "../../../core";
import { ArweaveTransaction, FullArweaveTransaction } from "../../../core/arweave/abstract/types";
import { staticImplements, IAutoconfiguration, Logger } from "../../../utils";
import { IMessagesService, GetLatestMessagesParams, GetLatestMessagesResponse, GetLatestMessagesBySenderParams, GetLatestMessagesByRecipientParams, GetAllMessagesParams, GetAllMessagesBySenderParams, GetAllMessagesByRecipientParams } from "./abstract";
import { AO_MIN_INGESTED_AT, DEFAULT_AO_TAGS } from "./constants";
import { GetLatestMessagesError } from "./MessagesServiceError";

/**
 * @category On-chain-data
 */
@staticImplements<IAutoconfiguration>()
export class MessagesService implements IMessagesService {
	private constructor(
		private readonly arweaveDataService: IArweaveDataService
	) { }


	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): IMessagesService {
		return new MessagesService(
			ArweaveDataService.autoConfiguration()
		)
	}

	/**
	 * Creates a MessagesService instance with a custom ArweaveDataService
	 * @param arweaveDataService The custom ArweaveDataService to use
	 * @returns A MessagesService instance
	 */
	public static withArweaveDataService(arweaveDataService: IArweaveDataService): IMessagesService {
		return new MessagesService(arweaveDataService);
	}

	private async getAllMessagesPaginated(params: GetLatestMessagesParams): Promise<ArweaveTransaction[]> {
		const allMessages: ArweaveTransaction[] = [];
		let currentCursor: string | undefined;
		let hasMore = true;

		while (hasMore) {
			const result = await this.getLatestMessages({
				...params,
				cursor: currentCursor,
				limit: 100
			});

			allMessages.push(...result.messages);
			hasMore = result.hasNextPage;
			currentCursor = result.cursor;
		}

		return allMessages;
	}

	public async getLatestMessages(params: GetLatestMessagesParams = {}): Promise<GetLatestMessagesResponse> {
		try {
			// Combine with user provided tags if any
			const allTags = params.tags
				? [...DEFAULT_AO_TAGS, ...params.tags]
				: DEFAULT_AO_TAGS;
			const builder = new ArweaveGQLBuilder()
				.withAllFields()
				.sortBy(ArweaveGQLSortOrder.HEIGHT_DESC)
				.limit(params.limit || 100)
				.tags(allTags);

			// Add recipient tag if specified
			if (params.recipient) {
				builder.recipient(params.recipient);
			}

			if (params.cursor) {
				builder.after(params.cursor);
			}

			if (params.owner) {
				builder.owner(params.owner);
			}

			const response = await this.arweaveDataService.query(builder);
			if (!response.data) {
				Logger.info(response)
			}
			const edges = response.data.transactions.edges;

			return {
				messages: edges.map(edge => edge.node),
				cursor: edges[edges.length - 1]?.cursor || "",
				hasNextPage: edges.length === (params.limit || 100)
			};
		} catch (error: any) {

			Logger.error(`Error retrieving latest messages: ${error.message}`);
			throw new GetLatestMessagesError(error);
		}
	}

	public async getLatestMessagesSentBy(params: GetLatestMessagesBySenderParams): Promise<GetLatestMessagesResponse> {
		return this.getLatestMessages({
			...params,
			owner: params.id
		});
	}

	public async getLatestMessagesReceivedBy(params: GetLatestMessagesByRecipientParams): Promise<GetLatestMessagesResponse> {
		return this.getLatestMessages({
			...params,
			recipient: params.recipientId
		});
	}

	public async getAllMessages(params: GetAllMessagesParams = {}): Promise<ArweaveTransaction[]> {
		return this.getAllMessagesPaginated(params);
	}

	public async getAllMessagesSentBy(params: GetAllMessagesBySenderParams): Promise<ArweaveTransaction[]> {
		return this.getAllMessagesPaginated({
			...params,
			owner: params.id
		});
	}

	public async getAllMessagesReceivedBy(params: GetAllMessagesByRecipientParams): Promise<ArweaveTransaction[]> {
		return this.getAllMessagesPaginated({
			...params,
			recipient: params.recipientId
		});
	}

	public async countAllMessages(params: GetAllMessagesParams): Promise<number> {
		try {
			// Always include Data-Protocol:ao tag
			// Combine with user provided tags if any
			const allTags = params.tags
				? [...DEFAULT_AO_TAGS, ...params.tags]
				: DEFAULT_AO_TAGS;
			const builder = new ArweaveGQLBuilder()
				.tags(allTags)
				.count()

			// Add recipient tag if specified
			if (params.recipient) {
				builder.recipient(params.recipient);
			}

			if (params.owner) {
				builder.owner(params.owner);
			}

			const response = await this.arweaveDataService.query(builder);
			return parseInt(response.data.transactions.count! as string)
		} catch (error: any) {
			Logger.error(`Error retrieving latest messages: ${error.message}`);
			throw new GetLatestMessagesError(error);
		}
	}

	public async getMessageById(id: string): Promise<ArweaveTransaction | undefined> {
		try {
			const builder = new ArweaveGQLBuilder()
				.id(id)
				.tags(DEFAULT_AO_TAGS)
				.minIngestedAt(AO_MIN_INGESTED_AT)
				.withAllFields();
			const transaction = await this.arweaveDataService.query(builder);
			return transaction.data.transactions.edges[0].node;
		} catch (error: any) {
			Logger.warn(`Error retrieving message ${id}: ${error.message}`);
			return undefined;
		}
	}

	public async getAllMessagesWithBuilder(builder: ArweaveGQLBuilder): Promise<ArweaveTransaction[]> {
		try {
			return await this.getAllMessagesWithBuilderPaginated(builder);
		} catch (error: any) {
			Logger.error(`Error retrieving messages with builder: ${error.message}`);
			throw new GetLatestMessagesError(error);
		}
	}

	private async getAllMessagesWithBuilderPaginated(builder: ArweaveGQLBuilder): Promise<ArweaveTransaction[]> {
		const allMessages: ArweaveTransaction[] = [];
		let currentCursor: string | undefined;
		let hasMore = true;

		// Get the limit from the builder using the getter method
		// If no limit is set, default to 100 for reasonable pagination
		const pageSize = builder.getLimit() || 100;

		// Ensure the builder has a limit set for pagination
		if (!builder.getLimit()) {
			builder.limit(pageSize);
		}

		while (hasMore) {
			// Use the provided builder and update cursor if needed
			if (currentCursor) {
				builder.after(currentCursor);
			}

			// Execute the query
			const response = await this.arweaveDataService.query(builder);

			if (!response.data || !response.data.transactions.edges) {
				break;
			}

			const edges = response.data.transactions.edges;
			allMessages.push(...edges.map(edge => edge.node));

			// Check if we have more pages - if we got a full page, there might be more
			hasMore = edges.length === pageSize;
			currentCursor = edges[edges.length - 1]?.cursor;

			// Safety check to prevent infinite loops
			if (!currentCursor) {
				hasMore = false;
			}
		}

		return allMessages;
	}


}
