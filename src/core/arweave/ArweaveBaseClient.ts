import Arweave from 'arweave';
import { IArweaveBaseClient } from './abstract/IArweaveBaseClient';
import { ArweaveGraphQLError } from './ArweaveBaseClientError';
import { Logger } from '../../utils/logger/logger';
import { getArweave } from './arweave';
import { ArweaveGQLBuilder } from './gql/ArweaveGQLBuilder';
import { ArweaveGQLResponse, ArweaveTransaction } from './abstract/types';

/**
 * @inheritdoc
 * Implements singleton pattern to ensure only one instance exists throughout the application.
 */
export class ArweaveBaseClient implements IArweaveBaseClient {
    /**
     * Singleton instance of ArweaveBaseClient.
     * Initialized on first getInstance() call.
     */
    private static instance: ArweaveBaseClient | null = null;
    private readonly arweave: Arweave;

    private constructor() {
        this.arweave = getArweave();
    }

    public static getInstance(): ArweaveBaseClient {
        if (!ArweaveBaseClient.instance) {
            ArweaveBaseClient.instance = new ArweaveBaseClient();
        }
        return ArweaveBaseClient.instance;
    }

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

    public async query(builder: ArweaveGQLBuilder): Promise<ArweaveGQLResponse> {
        if (!builder) {
            throw new ArweaveGraphQLError('No GQL builder provided');
        }

        const builtQuery = builder.build();
        return this.graphQuery<ArweaveGQLResponse>(builtQuery.query);
    }

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
}
