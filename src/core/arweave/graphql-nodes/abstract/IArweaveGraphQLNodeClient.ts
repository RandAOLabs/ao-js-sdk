import { JWKInterface } from 'arweave/node/lib/wallet';
import { ArweaveGQLResponse } from '../../abstract/types';
import { ArweaveNodeType } from './types';

/**
 * Interface for wrapping Arweave instance methods
 * Provides a clean abstraction over the Arweave client
 */
export interface IArweaveGraphQLNodeClient {
	/**
	 * Gets the node type this instance is configured for
	 */
	getNodeType(): ArweaveNodeType;

	/**
	 * Executes a GraphQL query against the Arweave node
	 * @param query The GraphQL query string to execute
	 * @returns Promise resolving to the query response
	 */
	graphqlQuery(query: string): Promise<ArweaveGQLResponse>;

	/**
	 * Makes a POST request to the specified endpoint
	 * @param endpoint The API endpoint to call
	 * @param data The data to send in the request body
	 * @returns Promise resolving to the response data
	 */
	apiPost<T = any>(endpoint: string, data: any): Promise<T>;

	/**
	 * Converts a JWK (JSON Web Key) to an Arweave address
	 * @param jwk The JWK to convert to an address
	 * @returns Promise resolving to the wallet address
	 */
	jwkToAddress(jwk: JWKInterface): Promise<string>;
}
