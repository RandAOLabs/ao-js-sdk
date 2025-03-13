import { ReadOnlyAOClient } from 'src/core/ao/ao-client/ReadOnlyAOClient';
import { connect } from '@permaweb/aoconnect';
import { DryRunParams } from 'src/core/ao/ao-client/abstract';

// Mock the aoconnect library and its functions
const mockResult = jest.fn();
const mockResults = jest.fn();
const mockDryrun = jest.fn();

jest.mock('@permaweb/aoconnect', () => ({
    connect: jest.fn().mockReturnValue({
        result: mockResult,
        results: mockResults,
        dryrun: mockDryrun
    })
}));

describe('ReadOnlyAOClient', () => {
    let client: ReadOnlyAOClient;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.resetAllMocks();
        client = new ReadOnlyAOClient();
    });

    it('should throw error when trying to send message', async () => {
        await expect(client.message('process-id')).rejects.toThrow();
    });

    it('should return results when fetching results', async () => {
        mockResults.mockResolvedValue({ success: true });
        const response = await client.results('process-id');
        expect(response).toBeDefined();
    });

    it('should return result when fetching single result', async () => {
        mockResult.mockResolvedValue({ success: true });
        const response = await client.result('process-id', 'message-id');
        expect(response).toBeDefined();
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
    });
});
