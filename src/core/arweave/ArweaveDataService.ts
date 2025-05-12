import Arweave from 'arweave';
import { IArweaveDataService } from './abstract/IArweaveDataService';
import { ArweaveGraphQLError } from './ArweaveDataServiceError';
import { Logger } from '../../utils/logger/logger';
import { getArweave } from './arweave';
import { ArweaveGQLBuilder } from './gql/ArweaveGQLBuilder';
import { ArweaveGQLResponse, ArweaveTransaction } from './abstract/types';
import { IAutoconfiguration, JsonUtils } from '../../utils';
import { staticImplements } from '../../utils/decorators';
import { ARWEAVE_DOT_NET_HTTP_CONFIG } from './constants';
import { 
	AxiosHttpClient, 
	HttpRequestConfig, 
	IHttpClient, 
	ResponseType
} from '../../utils/http';

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataService implements IArweaveDataService {
	private readonly arweave: Arweave;
	private readonly httpClient: IHttpClient;

	protected constructor() {
		this.arweave = getArweave();
		this.httpClient = new AxiosHttpClient(ARWEAVE_DOT_NET_HTTP_CONFIG);
	}

	public static autoConfiguration(): IArweaveDataService {
		return new ArweaveDataService();
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

	public async getTransactionData<T>(id: string): Promise<T> {
		if (!id) {
			throw new Error('No transaction ID provided');
		}

		try {
			const requestConfig: HttpRequestConfig<ArrayBuffer> = {
				responseType: ResponseType.ArrayBuffer,
				transformResponse: [(data: ArrayBuffer) => data]
			};

			const response = await this.httpClient.get<ArrayBuffer>(`/${id}`, requestConfig);
			// Convert ArrayBuffer to string and parse JSON
			const decoder = new TextDecoder('utf-8');
			const jsonString = decoder.decode(response);
			return JsonUtils.parse<T>(jsonString);
		} catch (error: any) {
			Logger.error(`Failed to get transaction data: ${error.message}`);
			throw error;
		}
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
