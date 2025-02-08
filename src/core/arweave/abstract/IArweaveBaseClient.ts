/**
 * IArweaveBaseClient provides GraphQL functionality for Arweave interactions.
 */
export interface IArweaveBaseClient {
    /**
     * Execute a GraphQL query against the Arweave network
     * 
     * @param query The GraphQL query string
     * @returns Promise resolving to the query response
     * @throws ArweaveGraphQLError if there is an error executing the query
     */
    graphQuery<T = any>(query: string): Promise<T>;
}
