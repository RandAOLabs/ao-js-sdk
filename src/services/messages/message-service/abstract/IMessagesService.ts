import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import {
	GetLatestMessagesParams,
	GetLatestMessagesResponse,
	GetLatestMessagesBySenderParams,
	GetLatestMessagesByRecipientParams,
	GetAllMessagesParams,
	GetAllMessagesBySenderParams,
	GetAllMessagesByRecipientParams
} from "./types";

export interface IMessagesService {
	/**
	 * Retrieves the latest messages with optional filtering and pagination
	 * @param params Optional parameters for filtering and pagination
	 * @returns Promise resolving to the messages response containing transactions and pagination info
	 * @throws MessagesServiceError if the query fails
	 */
	getLatestMessages(params?: GetLatestMessagesParams): Promise<GetLatestMessagesResponse>;

	/**
	 * Retrieves the latest messages sent by a specific address
	 * @param params Parameters for filtering and pagination, including required sender ID
	 * @returns Promise resolving to the messages response containing transactions and pagination info
	 * @throws MessagesServiceError if the query fails
	 */
	getLatestMessagesSentBy(params: GetLatestMessagesBySenderParams): Promise<GetLatestMessagesResponse>;

	/**
	 * Retrieves the latest messages received by a specific address
	 * @param params Parameters for filtering and pagination, including required recipient ID
	 * @returns Promise resolving to the messages response containing transactions and pagination info
	 * @throws MessagesServiceError if the query fails
	 */
	getLatestMessagesReceivedBy(params: GetLatestMessagesByRecipientParams): Promise<GetLatestMessagesResponse>;

	/**
	 * Retrieves all messages matching the given filters
	 * @param params Parameters for filtering messages
	 * @returns Promise resolving to all matching messages
	 * @throws MessagesServiceError if the query fails
	 */
	getAllMessages(params?: GetAllMessagesParams): Promise<ArweaveTransaction[]>;

	/**
	 * Retrieves all messages sent by a specific address
	 * @param params Parameters for filtering messages, including required sender ID
	 * @returns Promise resolving to all matching messages
	 * @throws MessagesServiceError if the query fails
	 */
	getAllMessagesSentBy(params: GetAllMessagesBySenderParams): Promise<ArweaveTransaction[]>;

	/**
	 * Retrieves all messages received by a specific address
	 * @param params Parameters for filtering messages, including required recipient ID
	 * @returns Promise resolving to all matching messages
	 * @throws MessagesServiceError if the query fails
	 */
	getAllMessagesReceivedBy(params: GetAllMessagesByRecipientParams): Promise<ArweaveTransaction[]>;

	/**
	 * Counts all messages for given criteria
	 * @param params Parameters for filtering messages
	 * @returns number of messages which match the criteria
	 * @throws MessagesServiceError if the query fails
	 */
	countAllMessages(params: GetAllMessagesParams): Promise<number>

	/**
	 * Retrieves a message by its ID
	 * @param id The message ID to retrieve
	 * @returns Promise resolving to the message or undefined if not found
	 * @throws MessagesServiceError if the query fails
	 */
	getMessageById(id: string): Promise<ArweaveTransaction | undefined>;

	/**
	 * Retrieves all messages using a custom GQL builder with automatic pagination
	 * @param builder The ArweaveGQLBuilder instance to use for querying
	 * @returns Promise resolving to all matching messages
	 * @throws MessagesServiceError if the query fails
	 */
	getAllMessagesWithBuilder(builder: any): Promise<ArweaveTransaction[]>;
}
