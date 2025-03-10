import { ReadOnlyAOClient } from 'src/core/ao/ao-client/ReadOnlyAOClient';
import { result, results, dryrun } from '@permaweb/aoconnect';

// Mock the aoconnect library
jest.mock('@permaweb/aoconnect', () => ({
    result: jest.fn(),
    results: jest.fn(),
    dryrun: jest.fn()
}));

describe('ReadOnlyAOClient', () => {
    let client: ReadOnlyAOClient;

    beforeEach(() => {
        client = new ReadOnlyAOClient();
        // Reset all mocks before each test
        jest.resetAllMocks();
    });

    it('should throw error when trying to send message', async () => {
        await expect(client.message('process-id')).rejects.toThrow();
    });

    it('should return results when fetching results', async () => {
        (results as jest.Mock).mockResolvedValue({ success: true });
        const response = await client.results('process-id');
        expect(response).toBeDefined();
    });

    it('should return result when fetching single result', async () => {
        (result as jest.Mock).mockResolvedValue({ success: true });
        const response = await client.result('process-id', 'message-id');
        expect(response).toBeDefined();
    });

    it('should return result when performing dryrun', async () => {
        (dryrun as jest.Mock).mockResolvedValue({ success: true });
        const response = await client.dryrun('process-id');
        expect(response).toBeDefined();
    });
});
