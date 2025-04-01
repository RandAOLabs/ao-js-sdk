import { Tags } from "../../../core";
import { ArweaveTransaction } from "../../../core/arweave/abstract/types";

/**
 * Base interface for message query parameters
 */
interface BaseMessageQueryParams {
    /**
     * Number of messages to retrieve (default: 100)
     */
    limit?: number;

    /**
     * Cursor for pagination
     */
    cursor?: string;

    /**
     * Tags to filter messages by
     */
    tags?: Tags;
}

/**
 * Parameters for general message queries
 */
export interface GetLatestMessagesParams extends BaseMessageQueryParams {
    /**
     * Owner address to filter messages by
     */
    owner?: string;

    /**
     * Recipient address to filter messages by
     */
    recipient?: string;
}

/**
 * Parameters for querying messages sent by an address
 */
export interface GetLatestMessagesBySenderParams extends BaseMessageQueryParams {
    /**
     * The sender's address
     */
    id: string;

    /**
     * Optional recipient address to filter by
     */
    recipient?: string;
}

/**
 * Parameters for querying messages received by an address
 */
export interface GetLatestMessagesByRecipientParams extends BaseMessageQueryParams {
    /**
     * The recipient's address
     */
    recipientId: string;

    /**
     * Optional sender address to filter by
     */
    owner?: string;
}

/**
 * Response structure for paginated message queries
 */
export interface GetLatestMessagesResponse {
    cursor: string;
    messages: ArweaveTransaction[];
    hasNextPage: boolean;
}

/**
 * Parameters for getting all messages (omits pagination params)
 */
export type GetAllMessagesParams = Omit<GetLatestMessagesParams, 'cursor' | 'limit'>;
export type GetAllMessagesBySenderParams = Omit<GetLatestMessagesBySenderParams, 'cursor' | 'limit'>;
export type GetAllMessagesByRecipientParams = Omit<GetLatestMessagesByRecipientParams, 'cursor' | 'limit'>;
