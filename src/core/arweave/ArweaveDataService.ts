import Arweave from 'arweave';
import { IArweaveDataService } from './abstract/IArweaveDataService';
import { ArweaveGraphQLError } from './ArweaveDataServiceError';
import { Logger } from '../../utils/logger/logger';
import { ArweaveGQLBuilder } from './gql/ArweaveGQLBuilder';
import { ArweaveGQLResponse, ArweaveTransaction } from './abstract/types';
import { IAutoconfiguration, JsonUtils } from '../../utils';
import { staticImplements } from '../../utils/decorators';
import {
	HttpRequestConfig,
	IHttpClient,
	ResponseType
} from '../../utils/http';
import { ArweaveNodeFactory, ArweaveNodeType } from './graphql-nodes';
import { getArweaveDotNetHttpClient } from './http-nodes/arweave-dot-net-http-client';

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataService implements IArweaveDataService {
	private readonly arweave: Arweave;
	private readonly httpClient: IHttpClient;

	protected constructor(_arweave:Arweave, _httpClient:IHttpClient ) {
		this.arweave = _arweave;
		this.httpClient = _httpClient;
	}


	public static autoConfiguration(): IArweaveDataService {
		const _arweave = ArweaveNodeFactory.getInstance().getNodeClient(ArweaveNodeType.GOLDSKY)
		const _httpClient = getArweaveDotNetHttpClient()
		return new ArweaveDataService(_arweave, _httpClient);
	}

	/** @protected */
	public async graphQuery<T = any>(query: string): Promise<T> {
		try {
			const response = await this.arweave.api.post('/graphql', {
				query: query
			});
			return response.data as T;
		} catch (error: any) {
			Logger.error(`GraphQL query error: ${error.message}`);
			throw new ArweaveGraphQLError(query, error);
		}
	}

	/** @protected */
	public async query(builder: ArweaveGQLBuilder): Promise<ArweaveGQLResponse> {
		if (!builder) {
			throw new ArweaveGraphQLError('No GQL builder provided');
		}

		const builtQuery = builder.build();

		return this.graphQuery<ArweaveGQLResponse>(builtQuery.query);
	}

	/** @protected */
	public async getTransactionById(id: string): Promise<ArweaveTransaction> {
		if (!id) {
			throw new ArweaveGraphQLError('No transaction ID provided');
		}

		const builder = new ArweaveGQLBuilder()
			.id(id)
			.withAllFields();

		const response = await this.query(builder);
		const transaction = response.data.transactions.edges[0]?.node;

		if (!transaction) {
			throw new ArweaveGraphQLError(`Transaction not found with ID: ${id}`);
		}

		return transaction;
	}

	public async getTransactionDataString(id: string): Promise<string> {
		if (!id) {
			throw new Error('No transaction ID provided');
		}

		try {
			const requestConfig: HttpRequestConfig<ArrayBuffer> = {
				responseType: ResponseType.ArrayBuffer,
				transformResponse: [(data: ArrayBuffer) => data]
			};

			const response = await this.httpClient.get<ArrayBuffer>(`/${id}`, requestConfig);
			// Convert ArrayBuffer to string
			const decoder = new TextDecoder('utf-8');
			return decoder.decode(response);
		} catch (error: any) {
			Logger.error(`Failed to get transaction data: ${error.message}`);
			throw error;
		}
	}

	public async getTransactionData<T>(id: string): Promise<T> {
		const dataString = await this.getTransactionDataString(id);
		return JsonUtils.parse<T>(dataString);
	}

	public async getWalletBalance(address: string): Promise<number> {
		if (!address) {
			throw new Error('No wallet address provided');
		}

		try {
			const response = await this.httpClient.get<number>(`/wallet/${address}/balance`);
			return response;
		} catch (error: any) {
			Logger.error(`Failed to get wallet balance: ${error.message}`);
			throw error;
		}
	}
}
