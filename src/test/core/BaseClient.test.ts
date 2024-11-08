import { BaseClient } from '../../core/BaseClient';
import { message, results, result, createDataItemSigner } from '@permaweb/aoconnect';
import { readFileSync } from 'fs';

// Mocking external dependencies
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    createDataItemSigner: jest.fn(),
}));
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
}));

describe('BaseClient', () => {
    // Mock variables used in each test
    const processId = 'test-process-id';
    const walletPath = 'test-wallet.json';
    const mockWallet = { key: 'value' };
    const mockSigner = 'mockSigner';

    // Variable to hold the BaseClient instance
    let client: BaseClient;

    // Setting up mocks and BaseClient instance before each test
    beforeEach(() => {
        (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockWallet));
        (createDataItemSigner as jest.Mock).mockReturnValue(mockSigner);
        client = new BaseClient(processId, walletPath);
    });

    // Reset mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test case: Constructor initializes correctly
     */
    describe('Constructor', () => {
        it('should initialize with correct processId and signer', () => {
            // Assertions to ensure client was instantiated as expected
            expect(client).toBeInstanceOf(BaseClient);
            expect((client as any).processId).toBe(processId);
            expect((client as any).signer).toBe(mockSigner);
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
            expect(message).toHaveBeenCalledWith({
                process: processId,
                signer: mockSigner,
                data,
                tags,
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
            const sort = 'DESC';

            // Act
            const response = await client.results(from, to, limit, sort);

            // Assert
            expect(results).toHaveBeenCalledWith({
                process: processId,
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
                process: processId,
            });
            expect(response).toEqual(mockResponse);
        });
    });
});
