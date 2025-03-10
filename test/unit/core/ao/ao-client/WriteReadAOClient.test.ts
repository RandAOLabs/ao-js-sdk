import { WriteReadAOClient } from 'src/core/ao/ao-client/WriteReadAOClient';
import { message, createDataItemSigner } from '@permaweb/aoconnect';

// Mock the aoconnect library
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    createDataItemSigner: jest.fn()
}));

describe('WriteReadAOClient', () => {
    let client: WriteReadAOClient;
    const mockSigner = {} as ReturnType<typeof createDataItemSigner>;

    beforeEach(() => {
        client = new WriteReadAOClient(mockSigner);
        // Reset all mocks before each test
        jest.resetAllMocks();
    });

    it('should return message id when sending message', async () => {
        (message as jest.Mock).mockResolvedValue('message-id');
        const response = await client.message('process-id');
        expect(response).toBeDefined();
    });

    // Note: We don't need to test results, result, and dryrun here
    // as they are inherited from ReadOnlyAOClient and already tested there
});
