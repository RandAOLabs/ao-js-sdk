import Arweave from 'arweave';
import { IBaseArweaveDataService } from './abstract/IArweaveBaseClient';
import { ArweaveGraphQLError } from './ArweaveDataServiceError';
import { Logger } from '../../utils/logger/logger';
import { getArweave } from './arweave';
import { ArweaveGQLBuilder } from './gql/ArweaveGQLBuilder';
import { ArweaveGQLResponse, ArweaveTransaction } from './abstract/types';

/**
 * @category Core
 */
export class BaseArweaveDataService implements IBaseArweaveDataService {
    private readonly arweave: Arweave;

    public constructor() {
        this.arweave = getArweave();
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
}
