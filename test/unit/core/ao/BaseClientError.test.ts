// Create mock functions that will be shared between direct imports and connect() return value
const message = jest.fn();
const results = jest.fn();
const result = jest.fn();
const dryrun = jest.fn();
const mockCreateDataItemSigner = jest.fn();

jest.mock('@permaweb/aoconnect', () => ({
    // Direct exports
    createDataItemSigner: mockCreateDataItemSigner,
    // connect function that returns the same mock functions
    connect: jest.fn().mockReturnValue({
        message: message,
        results: results,
        result: result,
        dryrun: dryrun,
        createDataItemSigner: mockCreateDataItemSigner
    })
}));

import { createDataItemSigner } from '@permaweb/aoconnect';
import { Logger, SortOrder } from 'src';
import { AOClientError } from 'src/core/ao/ao-client';
import { BaseClient } from 'src/core/ao/BaseClient';
import { BaseClientConfigBuilder } from 'src/core/ao/configuration/builder';


//mocks
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
        const config = new BaseClientConfigBuilder()
            .withProcessId("test-process-id")
            .build()
        client = new BaseClient(config)
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
            await expect(client.message(data, tags)).rejects.toThrow(AOClientError);
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
            (results as jest.Mock).mockRejectedValue(new Error(errorMessage));
            const from = 'start-id';
            const to = 'end-id';
            const limit = 10;
            const sort = SortOrder.DESCENDING;

            // Act & Assert
            await expect(client.results(from, to, limit, sort)).rejects.toThrow(AOClientError);
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
            (result as jest.Mock).mockRejectedValue(new Error(errorMessage));
            const messageId = 'message-id';

            // Act & Assert
            await expect(client.result(messageId)).rejects.toThrow(AOClientError);
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
            (dryrun as jest.Mock).mockRejectedValue(new Error(errorMessage));
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];

            // Act & Assert
            await expect(client.dryrun(data, tags)).rejects.toThrow(AOClientError);
            expect(Logger.error).toHaveBeenCalled();
        });
    });
});
