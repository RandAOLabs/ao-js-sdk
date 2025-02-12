import { message, results, result, dryrun } from '@permaweb/aoconnect';
import { SortOrder, SyncBaseClient } from 'src';
import { BaseClient } from 'src/core/ao/BaseClient';
import { DEFAULT_TAGS } from 'src/core/ao/constants';


// Mocking external dependencies

//mocks

jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    dryrun: jest.fn(),
    createDataItemSigner: jest.fn(), // Create a Jest mock function here
}));
jest.mock('src/utils/logger/logger', () => ({
    Logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

describe("BaseClient", () => {
    // Variable to hold the BaseClient instance
    let client: BaseClient;

    // Setting up mocks and BaseClient instance before each test
    beforeEach(() => {
        client = SyncBaseClient.autoConfiguration()
    });

    // Reset mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test case: Constructor initializes correctly
     */
    describe('Autoconfiguration Constructor', () => {
        it('should initialize with correct processId and signer', () => {
            expect(client.baseConfig).toBeDefined();
        });
    });

    /**
     * Test case: Sending a message
     */
    describe('message()', () => {
        it('should send a message with correct parameters', async () => {
            // Arrange
            (message as jest.Mock).mockResolvedValueOnce(undefined);
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];
            const anchor = 'anchor123';

            // Act
            await expect(client.message(data, tags, anchor)).resolves.toBeUndefined();

            // Assert
            const expectedTags = [
                ...DEFAULT_TAGS,
                { name: 'tag1', value: 'value1' }
            ];
            expect(message).toHaveBeenCalledWith({
                process: client.baseConfig.processId,
                signer: undefined,
                data,
                tags: expectedTags,
                anchor,
            });
        });
    });

    /**
     * Test case: Fetching multiple results
     */
    describe('results()', () => {
        it('should fetch results with correct parameters and return data', async () => {
            // Arrange
            const mockResponse = [{ id: '1', data: 'result1' }];
            (results as jest.Mock).mockResolvedValueOnce(mockResponse);
            const from = 'start-id';
            const to = 'end-id';
            const limit = 10;
            const sort = SortOrder.DESCENDING;

            // Act
            const response = await client.results(from, to, limit, sort);

            // Assert
            expect(results).toHaveBeenCalledWith({
                process: client.baseConfig.processId,
                from,
                to,
                limit,
                sort,
            });
            expect(response).toEqual(mockResponse);
        });
    });

    /**
     * Test case: Fetching a single result by message ID
     */
    describe('result()', () => {
        it('should fetch a result by message ID with correct parameters', async () => {
            // Arrange
            const mockResponse = { id: 'message-id', data: 'result-data' };
            (result as jest.Mock).mockResolvedValueOnce(mockResponse);
            const messageId = 'message-id';

            // Act
            const response = await client.result(messageId);

            // Assert
            expect(result).toHaveBeenCalledWith({
                message: messageId,
                process: client.baseConfig.processId,
            });
            expect(response).toEqual(mockResponse);
        });
    });
    /**
     * Test case: Performing a dry run
     */
    describe('dryrun()', () => {
        it('should perform a dry run with correct parameters', async () => {
            // Arrange
            const mockResponse = { success: true };
            (dryrun as jest.Mock).mockResolvedValueOnce(mockResponse);
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];
            const anchor = 'anchor123';
            const id = 'test-id';
            const owner = 'test-owner';

            // Act
            const response = await client.dryrun(data, tags, anchor, id, owner);

            // Assert
            const expectedTags = [
                ...DEFAULT_TAGS,
                { name: 'tag1', value: 'value1' }
            ];
            expect(dryrun).toHaveBeenCalledWith({
                process: client.baseConfig.processId,
                data,
                tags: expectedTags,
                anchor,
                id,
                owner,
            });
            expect(response).toEqual(mockResponse);
        });
    });
});
