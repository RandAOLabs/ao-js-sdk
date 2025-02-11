import { ArweaveGQLBuilder } from '../gql/ArweaveGQLBuilder';
import { ArweaveGQLResponse } from './types';

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

    /**
     * Execute a GraphQL query using an ArweaveGQLBuilder instance
     * 
     * @param builder The ArweaveGQLBuilder instance containing the query configuration
     * @returns Promise resolving to the strongly-typed query response
     * @throws ArweaveGraphQLError if there is an error executing the query or if no builder is provided
     */
    query(builder: ArweaveGQLBuilder): Promise<ArweaveGQLResponse>;
}
