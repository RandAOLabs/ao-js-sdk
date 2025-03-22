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


import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { BaseClient } from 'src/core/ao/BaseClient';
import { BaseClientConfigBuilder } from 'src/core/ao/configuration/builder';
import { DEFAULT_TAGS } from 'src/core/ao/constants';

/*
* Mocks the logger for tests to suppress log outputs.
* Logs a warning that logging has been disabled for the current test suite.
*/
jest.mock('src/utils/logger/logger', () => {
    const actualLogger = jest.requireActual('src/utils/logger/logger');
    return {
        ...actualLogger,
        Logger: {
            ...actualLogger.Logger,
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            log: jest.fn(),
        },
    };
});

describe("BaseClient Dry Run Tests", () => {
    let client: BaseClient;
    beforeEach(() => {
        const config = new BaseClientConfigBuilder()
            .withProcessId("test-process-id")
            .build()
        client = new BaseClient(config)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Initial dry run setting", () => {
        it("should default useDryRunAsMessage to false", () => {
            expect(client.isRunningDryRunsAsMessages()).toBe(false);
        });
    });

    describe("setDryRunAsMessage()", () => {
        it("should enable dry run as message when set to true", () => {
            client.setDryRunAsMessage(true);
            expect(client.isRunningDryRunsAsMessages()).toBe(true);
        });

        it("should disable dry run as message when set to false", () => {
            client.setDryRunAsMessage(false);
            expect(client.isRunningDryRunsAsMessages()).toBe(false);
        });
    });

    describe("dryrun()", () => {
        it("should call message and result when useDryRunAsMessage is true", async () => {
            // Arrange
            client.setDryRunAsMessage(true);
            const mockMessageId = 'message-id';
            const mockResponse: MessageResult = {
                Output: undefined,
                Messages: [],
                Spawns: []
            };
            (message as jest.Mock).mockResolvedValueOnce(mockMessageId);
            (result as jest.Mock).mockResolvedValueOnce(mockResponse);
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];

            // Act
            const response = await client.dryrun(data, tags);

            // Assert
            const expectedTags = [
                ...DEFAULT_TAGS,
                { name: 'tag1', value: 'value1' }
            ];
            expect(message).toHaveBeenCalled();
            expect(result).toHaveBeenCalledWith({
                message: mockMessageId,
                process: client.baseConfig.processId,
            });
            expect(response).toEqual(mockResponse);
        });

        it("should call dryrun when useDryRunAsMessage is false", async () => {
            // Arrange
            client.setDryRunAsMessage(false);
            const mockResponse: DryRunResult = {
                Output: undefined,
                Messages: [],
                Spawns: []
            };
            (dryrun as jest.Mock).mockResolvedValueOnce(mockResponse);
            const data = 'test-data';
            const tags = [{ name: 'tag1', value: 'value1' }];

            // Act
            const response = await client.dryrun(data, tags);

            // Assert
            const expectedTags = [
                { name: 'tag1', value: 'value1' },
                ...DEFAULT_TAGS
            ];
            expect(dryrun).toHaveBeenCalledWith({
                process: client.baseConfig.processId,
                data,
                tags: expectedTags,
                anchor: undefined,
                id: undefined,
                owner: undefined,
            });
            expect(response).toEqual(mockResponse);
        });
    });
});
