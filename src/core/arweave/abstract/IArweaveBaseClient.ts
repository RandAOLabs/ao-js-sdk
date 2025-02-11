import { ArweaveGQLBuilder } from "../gql/ArweaveGQLBuilder";
import { ArweaveGQLResponse, ArweaveTransaction } from "./types";

export interface IArweaveBaseClient {
    /**
     * Executes a raw GraphQL query
     * @param query The GraphQL query string
     * @returns Promise resolving to the query response
     * @throws ArweaveGraphQLError if the query fails
     */
    graphQuery<T = any>(query: string): Promise<T>;

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
     * @returns Promise resolving to the transaction data
     * @throws ArweaveGraphQLError if the query fails or transaction not found
     */
    getTransactionById(id: string): Promise<ArweaveTransaction>;
}
