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


import { WriteReadAOClient } from 'src/core/ao/ao-client/WriteReadAOClient';
import { createDataItemSigner } from '@permaweb/aoconnect';

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
