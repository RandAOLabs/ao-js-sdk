// Create mock functions that will be shared between direct imports and connect() return value
const mockMessage = jest.fn();
const mockResults = jest.fn();
const mockResult = jest.fn();
const mockDryrun = jest.fn();
const mockCreateDataItemSigner = jest.fn();

jest.mock('@permaweb/aoconnect', () => ({
    // Direct exports
    createDataItemSigner: mockCreateDataItemSigner,
    // connect function that returns the same mock functions
    connect: jest.fn().mockReturnValue({
        message: mockMessage,
        results: mockResults,
        result: mockResult,
        dryrun: mockDryrun,
        createDataItemSigner: mockCreateDataItemSigner
    })
}));

import { ReadOnlyAOClient } from 'src/core/ao/ao-client/ReadOnlyAOClient';
import { DryRunParams } from 'src/core/ao/ao-client/abstract';

describe('ReadOnlyAOClient', () => {
    let client: ReadOnlyAOClient;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        client = new ReadOnlyAOClient();
    });

    it('should throw error when trying to send message', async () => {
        await expect(client.message('process-id')).rejects.toThrow();
    });

    it('should return results when fetching results', async () => {
        mockResults.mockResolvedValue({ success: true });
        const response = await client.results({process:'process-id'});
        expect(response).toBeDefined();
        expect(mockResults).toHaveBeenCalledWith({
            process: 'process-id',
            from: undefined,
            to: undefined,
            limit: 25,
            sort: 'ASC'
        });
    });

    it('should return result when fetching single result', async () => {
        mockResult.mockResolvedValue({ success: true });
        const response = await client.result({
            process:'process-id',
             message:'message-id'
        });
        expect(response).toBeDefined();
        expect(mockResult).toHaveBeenCalledWith({
            process: 'process-id',
            message: 'message-id'
        });
    });

    it('should return result when performing dryrun', async () => {
        mockDryrun.mockResolvedValue({ success: true });
        const params: DryRunParams = {
            process: 'process-id',
            data: '',
            tags: []
        };
        const response = await client.dryrun(params);
        expect(response).toBeDefined();
        expect(mockDryrun).toHaveBeenCalledWith(params);
    });
});
