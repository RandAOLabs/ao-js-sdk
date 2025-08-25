import { IArweaveDataService } from '../../../../src/core/arweave/abstract/IArweaveDataService';
import { ArweaveDataService } from '../../../../src/core/arweave/ArweaveDataService';
import { ArweaveGraphQLError } from '../../../../src/core/arweave/ArweaveDataServiceError';
import { ArweaveGQLBuilder } from '../../../../src/core/arweave/gql/ArweaveGQLBuilder';

// Create a proper mock response object
const mockGraphqlQuery = jest.fn();

// Mock the ArweaveGraphQLNodeClientFactory
jest.mock('../../../../src/core/arweave/graphql-nodes/ArweaveGraphQLNodeClientFactory.ts', () => ({
	ArweaveGraphQLNodeClientFactory: {
		getInstance: jest.fn(() => ({
			getNode: jest.fn(() => ({
				graphqlQuery: mockGraphqlQuery
			}))
		}))
	}
}));

// Mock the HTTP client
jest.mock('../../../../src/core/arweave/http-nodes/arweave-dot-net-http-client', () => ({
	getArweaveDotNetHttpClient: jest.fn(() => ({}))
}));

// Mock the logger
jest.mock('../../../../src/utils/logger/logger', () => ({
	Logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

describe('ArweaveBaseClient', () => {
	let client: IArweaveDataService;

	beforeEach(() => {
		// Reset the singleton instance
		(ArweaveDataService as any).instance = null;

		// Clear mock data
		mockGraphqlQuery.mockClear();

		// Get a new instance
		client = ArweaveDataService.autoConfiguration();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getInstance', () => {
		describe('query', () => {
			it('should successfully execute a query using GQL builder', async () => {
				const mockResponse = {
					data: {
						transactions: {
							edges: [
								{
									cursor: 'cursor1',
									node: {
										id: 'test-id',
										owner: {
											address: 'owner-address'
										},
										tags: [
											{
												name: 'Content-Type',
												value: 'text/plain'
											}
										]
									}
								}
							]
						}
					}
				};

				mockGraphqlQuery.mockResolvedValueOnce(mockResponse);

				const builder = new ArweaveGQLBuilder()
					.withOwner()
					.withTags()
					.limit(1);

				const result = await client.query(builder);

				expect(mockGraphqlQuery).toHaveBeenCalledWith(
					expect.stringContaining('transactions')
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw ArweaveGraphQLError when builder is not provided', async () => {
				await expect(client.query(undefined as any))
					.rejects
					.toThrow(ArweaveGraphQLError);
			});

			it('should throw ArweaveGraphQLError when query execution fails', async () => {
				mockGraphqlQuery.mockRejectedValueOnce(new ArweaveGraphQLError('test query', new Error('Query failed')));

				const builder = new ArweaveGQLBuilder()
					.withOwner()
					.limit(1);

				await expect(client.query(builder))
					.rejects
					.toThrow(ArweaveGraphQLError);
			});
		});
	});

	describe('graphQuery', () => {
		it('should successfully execute a GraphQL query', async () => {
			// Mock response with correct structure
			const mockResponse = {
				data: {
					transactions: {
						edges: [
							{
								node: { id: 'test-id' }
							}
						]
					}
				}
			};

			// Set up the mock to return a proper response
			mockGraphqlQuery.mockResolvedValueOnce(mockResponse);

			// Test query
			const query = 'query { transactions { edges { node { id } } } }';
			const result = await client.graphQuery(query);

			// Assertions
			expect(mockGraphqlQuery).toHaveBeenCalledWith(query);
			expect(result).toEqual(mockResponse);
		});

		it('should throw ArweaveGraphQLError when query fails', async () => {
			// Mock error - should throw ArweaveGraphQLError since that's what the real implementation does
			const errorMessage = 'GraphQL query failed';
			mockGraphqlQuery.mockRejectedValueOnce(new ArweaveGraphQLError('invalid query', new Error(errorMessage)));

			// Test query
			const query = 'invalid query';

			// Assertion
			await expect(client.graphQuery(query)).rejects.toThrow(ArweaveGraphQLError);
		});
	});
});
