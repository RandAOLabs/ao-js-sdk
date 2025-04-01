import { BaseArweaveDataService } from "../../core/arweave/ArweaveDataService";
import { ArweaveGQLBuilder } from "../../core/arweave/gql/ArweaveGQLBuilder";
import { Logger } from "../../utils/logger/logger";
import { IMessagesService } from "./abstract/IMessagesService";
import { GetLatestMessagesError } from "./MessagesServiceError";
import {
    GetLatestMessagesParams,
    GetLatestMessagesResponse,
    GetLatestMessagesBySenderParams,
    GetLatestMessagesByRecipientParams,
    GetAllMessagesParams,
    GetAllMessagesBySenderParams,
    GetAllMessagesByRecipientParams
} from "./abstract/types";
import { ArweaveGQLSortOrder } from "../../core/arweave/gql/types";
import { ArweaveTransaction } from "../../core/arweave/abstract/types";
import { DEFAULT_AO_TAGS } from "./constants";

/**
 * @category On-chain-data
 */
export class MessagesService extends BaseArweaveDataService implements IMessagesService {
    constructor() {
        super();
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
                builder.recipient(params.recipient)
            }

            if (params.cursor) {
                builder.after(params.cursor);
            }

            if (params.owner) {
                builder.owner(params.owner);
            }

            const response = await this.query(builder);
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
                builder.recipient(params.recipient)
            }

            if (params.owner) {
                builder.owner(params.owner);
            }

            const response = await this.query(builder);
            return response.data.transactions.count!
        } catch (error: any) {
            Logger.error(`Error retrieving latest messages: ${error.message}`);
            throw new GetLatestMessagesError(error);
        }
    }
}
