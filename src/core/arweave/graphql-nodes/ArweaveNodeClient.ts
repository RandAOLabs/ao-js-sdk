import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { IArweaveNodeClient as IArweaveNodeClient } from './abstract/IArweaveNodeClient';
import { ArweaveNodeType } from './abstract/types';
import { Logger } from '../../../utils';
import { ArweaveGraphQLError } from '../ArweaveDataServiceError';
import { ArweaveGQLResponse } from '../abstract/types';
import { ArweaveNodeClientError, MalformedArweaveNodeResponseError } from './error';

/**
 * Concrete implementation of IArweaveNode that wraps an Arweave instance
 * Provides a clean abstraction over the Arweave client methods
 */
export class ArweaveNodeClient implements IArweaveNodeClient {
	private readonly arweave: Arweave;
	private readonly nodeType: ArweaveNodeType;

	constructor(arweave: Arweave, nodeType: ArweaveNodeType) {
		this.arweave = arweave;
		this.nodeType = nodeType;
	}

	/**
	 * Gets the node type this instance is configured for
	 */
	public getNodeType(): ArweaveNodeType {
		return this.nodeType;
	}

	/**
	 * Executes a GraphQL query against the Arweave node
	 * @param query The GraphQL query string to execute
	 * @returns Promise resolving to the query response
	 */
	public async graphqlQuery(query: string): Promise<ArweaveGQLResponse> {
		try {
			const response = await this.arweave.api.post('/graphql', {
				query: query
			});
			if (typeof response == "string" || typeof response.data == "string") {
				throw new MalformedArweaveNodeResponseError(this, this.graphqlQuery, query, response)
			}
			return response.data as ArweaveGQLResponse;
		} catch (error: any) {
			Logger.error(`GraphQL query error on ${this.nodeType} node: ${error.message}`);
			throw new ArweaveGraphQLError(query, error);
		}
	}

	/**
	 * Makes a POST request to the specified endpoint
	 * @param endpoint The API endpoint to call
	 * @param data The data to send in the request body
	 * @returns Promise resolving to the response data
	 */
	public async apiPost<T = any>(endpoint: string, data: any): Promise<T> {
		try {
			const response = await this.arweave.api.post(endpoint, data);
			return response.data as T;
		} catch (error: any) {
			Logger.error(`API POST error on ${this.nodeType} node to ${endpoint}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Converts a JWK (JSON Web Key) to an Arweave address
	 * @param jwk The JWK to convert to an address
	 * @returns Promise resolving to the wallet address
	 */
	public async jwkToAddress(jwk: JWKInterface): Promise<string> {
		try {
			return await this.arweave.wallets.jwkToAddress(jwk);
		} catch (error: any) {
			Logger.error(`JWK to address conversion error on ${this.nodeType} node: ${error.message}`);
			throw error;
		}
	}
}
