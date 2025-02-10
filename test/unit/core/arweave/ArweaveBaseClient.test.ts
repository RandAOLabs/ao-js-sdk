import { ArweaveBaseClient } from '../../../../src/core/arweave/ArweaveBaseClient';
import { ArweaveGraphQLError } from '../../../../src/core/arweave/ArweaveBaseClientError';

// Create a proper mock response object
const mockApiPost = jest.fn();

// Mock the arweave module with a proper API structure
jest.mock('../../../../src/core/arweave/arweave', () => ({
    getArweave: jest.fn(() => ({
        api: {
            post: mockApiPost
        }
    }))
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
    let client: ArweaveBaseClient;

    beforeEach(() => {
        // Reset the singleton instance
        (ArweaveBaseClient as any).instance = null;

        // Clear mock data
        mockApiPost.mockClear();

        // Get a new instance
        client = ArweaveBaseClient.getInstance();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInstance', () => {
        it('should return the same instance on multiple calls', () => {
            const instance1 = ArweaveBaseClient.getInstance();
            const instance2 = ArweaveBaseClient.getInstance();
            expect(instance1).toBe(instance2);
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
            mockApiPost.mockResolvedValueOnce({
                ok: true,
                status: 200,
                data: mockResponse
            });

            // Test query
            const query = 'query { transactions { edges { node { id } } } }';
            const result = await client.graphQuery(query);

            // Assertions
            expect(mockApiPost).toHaveBeenCalledWith('/graphql', { query });
            expect(result).toEqual(mockResponse);
        });

        it('should throw ArweaveGraphQLError when query fails', async () => {
            // Mock error
            const errorMessage = 'GraphQL query failed';
            mockApiPost.mockRejectedValueOnce(new Error(errorMessage));

            // Test query
            const query = 'invalid query';

            // Assertion
            await expect(client.graphQuery(query)).rejects.toThrow(ArweaveGraphQLError);
        });
    });
});
