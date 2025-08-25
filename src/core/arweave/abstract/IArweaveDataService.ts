import { ArweaveGQLBuilder } from "../gql/ArweaveGQLBuilder";
import { ArweaveGQLResponse, ArweaveTransaction } from "./types";

export interface IArweaveDataService {
	/**
	 * Executes a raw GraphQL query
	 * @param query The GraphQL query string
	 * @returns Promise resolving to the query response
	 * @throws ArweaveGraphQLError if the query fails
	 */
	graphQuery(query: string): Promise<ArweaveGQLResponse>;
	/**
	 * Executes a query using an ArweaveGQLBuilder
	 * @param builder The ArweaveGQLBuilder instance
	 * @returns Promise resolving to the query response
	 * @throws ArweaveGraphQLError if the query fails or no builder is provided
	 */
	query(builder: ArweaveGQLBuilder): Promise<ArweaveGQLResponse>;

	/**
	 * Retrieves a transaction by its ID
	 * @param id The transaction ID to retrieve
	 * @returns Promise resolving to the transaction
	 * @throws ArweaveGraphQLError if the query fails or transaction not found
	 */
	getTransactionById(id: string): Promise<ArweaveTransaction>;

	/**
	 * Retrieves data for a transaction by its ID and parses it as JSON
	 * @param id The transaction ID to retrieve
	 * @returns Promise resolving to the parsed transaction data
	 */
	getTransactionData<T>(id: string): Promise<T>

	/**
	 * Retrieves data for a transaction by its ID as a string
	 * @param id The transaction ID to retrieve
	 * @returns Promise resolving to the transaction data as a string
	 */
	getTransactionDataString(id: string): Promise<string>;

	/**
	 * Gets the balance of an Arweave wallet address in Winston
	 * @param address The Arweave wallet address
	 * @returns Promise resolving to the wallet balance in Winston (divide by 1000000000000 to get AR)
	 * @throws Error if the address is invalid or request fails
	 */
	getWalletBalance(address: string): Promise<number>;
}
