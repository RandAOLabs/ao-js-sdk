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
import { ArweaveNodeFactory, ArweaveNodeType, IArweaveNodeClient } from './graphql-nodes';
import { getArweaveDotNetHttpClient } from './http-nodes/arweave-dot-net-http-client';

/**
 * @category Core
 */
@staticImplements<IAutoconfiguration>()
export class ArweaveDataService implements IArweaveDataService {
	private readonly arweaveNode: IArweaveNodeClient;
	private readonly httpClient: IHttpClient;

	protected constructor(_arweaveNode: IArweaveNodeClient, _httpClient: IHttpClient) {
		this.arweaveNode = _arweaveNode;
		this.httpClient = _httpClient;
	}


	public static autoConfiguration(): IArweaveDataService {
		const _arweaveNode = ArweaveNodeFactory.getInstance().getNode(ArweaveNodeType.ARIO_DEV)
		const _httpClient = getArweaveDotNetHttpClient()
		return new ArweaveDataService(_arweaveNode, _httpClient);
	}

	/** @protected */
	public async graphQuery(query: string): Promise<ArweaveGQLResponse> {
		return await this.arweaveNode.graphqlQuery(query);
	}

	/** @protected */
	public async query(builder: ArweaveGQLBuilder): Promise<ArweaveGQLResponse> {
		if (!builder) {
			throw new ArweaveGraphQLError('No GQL builder provided');
		}

		const builtQuery = builder.build(this.arweaveNode.getNodeType());
		Logger.debug(`Executing GQL query: ${builtQuery.query}`);
		const response = await this.graphQuery(builtQuery.query);
		if (!response.data) {
			Logger.warn(response)
		}
		return response
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
