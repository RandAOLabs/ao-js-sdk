import { message, result, results, createDataItemSigner, dryrun } from '@permaweb/aoconnect';
import { MessageError, Logger, SortOrder, ResultsError, ResultError, DryRunError, SyncBaseClient } from 'src';
import { BaseClient } from 'src/core/ao/BaseClient';


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

describe("BaseClient Error Handling", () => {
    // Variable to hold the BaseClient instance
    let client: BaseClient;

    // Setting up mocks and BaseClient instance before each test
    beforeEach(() => {
        (createDataItemSigner as jest.Mock).mockReturnValue("mockSigner");
        client = SyncBaseClient.autoConfiguration();
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

    /**
     * Test case: Error handling when performing a dry run
     */
    describe('dryrun() error handling', () => {
        it('should throw DryRunError and log an error when dry run fails', async () => {
            // Arrange
            const errorMessage = 'Failed to perform dry run';
            (dryrun as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];

            // Act & Assert
            await expect(client.dryrun(data, tags)).rejects.toThrow(DryRunError);
            expect(Logger.error).toHaveBeenCalled();
        });
    });
});
