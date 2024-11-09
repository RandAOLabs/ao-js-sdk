import { message, result, results, createDataItemSigner } from '@permaweb/aoconnect';
import { BaseClient, SortOrder, MessageError, ResultError, ResultsError } from '@core/index';
import { readFileSync } from 'fs';
import { Logger } from '@utils/logger/logger';

// Mocking external dependencies
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    createDataItemSigner: jest.fn(),
}));

jest.mock('@utils/logger/logger', () => ({
    Logger: {
        error: jest.fn(),
    },
}));

describe("BaseClient Error Handling", () => {
    const mockWallet = { key: 'value' };
    const mockSigner = 'mockSigner';

    // Variable to hold the BaseClient instance
    let client: BaseClient;

    // Setting up mocks and BaseClient instance before each test
    beforeEach(() => {
        (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockWallet));
        (createDataItemSigner as jest.Mock).mockReturnValue(mockSigner);
        client = BaseClient.autoConfiguration();
    });

    // Reset mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test case: Error handling when sending a message
     */
    describe('message() error handling', () => {
        it('should throw MessageError and log an error when message fails', async () => {
            // Arrange
            const errorMessage = 'Failed to send message';
            (message as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];

            // Act & Assert
            await expect(client.message(data, tags)).rejects.toThrow(MessageError);
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Error handling when fetching multiple results
     */
    describe('results() error handling', () => {
        it('should throw ResultsError and log an error when results fetching fails', async () => {
            // Arrange
            const errorMessage = 'Failed to fetch results';
            (results as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
            const from = 'start-id';
            const to = 'end-id';
            const limit = 10;
            const sort = SortOrder.DESCENDING;

            // Act & Assert
            await expect(client.results(from, to, limit, sort)).rejects.toThrow(ResultsError);
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Error handling when fetching a single result by message ID
     */
    describe('result() error handling', () => {
        it('should throw ResultError and log an error when result fetching fails', async () => {
            // Arrange
            const errorMessage = 'Failed to fetch result';
            (result as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
            const messageId = 'message-id';

            // Act & Assert
            await expect(client.result(messageId)).rejects.toThrow(ResultError);
            expect(Logger.error).toHaveBeenCalled();
        });
    });
});
