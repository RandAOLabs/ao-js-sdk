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

import { BaseClient } from 'src/core/ao/BaseClient';
import { BaseClientConfigBuilder } from 'src/core/ao/configuration/builder';
import { JWKInterface } from 'arweave/node/lib/wallet';

// Mock getWalletLazy
jest.mock('src/utils/wallet', () => ({
    getWalletSafely: jest.fn().mockReturnValue(undefined)
}));


// Mock the logger
jest.mock('src/utils/logger/logger', () => ({
    Logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

describe('BaseClient Constructor Tests', () => {
    const mockWallet: JWKInterface = {
        kty: 'RSA',
        n: 'mock-n',
        e: 'mock-e'
    };
    const processId = 'test-process-id';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('With Wallet', () => {
        let client: BaseClient;

        beforeEach(() => {
            const config = new BaseClientConfigBuilder()
                .withProcessId(processId)
                .withWallet(mockWallet)
                .build();
            client = new BaseClient(config);
        });

        it('should successfully send message when initialized with wallet', async () => {
            (message as jest.Mock).mockResolvedValue('message-id');
            const response = await client.message('test-data');
            expect(response).toBeDefined();
        });

        it('should successfully perform dryrun', async () => {
            (dryrun as jest.Mock).mockResolvedValue({ success: true });
            const response = await client.dryrun('test-data');
            expect(response).toBeDefined();
        });
    });

    describe('Without Wallet', () => {
        let client: BaseClient;

        beforeEach(() => {
            const config = new BaseClientConfigBuilder()
                .withProcessId(processId)
                .allowDefaults(false)
                .build();
            client = new BaseClient(config);
        });

        it('should throw error when trying to send message without wallet', async () => {
            await expect(client.message('test-data')).rejects.toThrow();
        });

        it('should successfully perform dryrun even without wallet', async () => {
            (dryrun as jest.Mock).mockResolvedValue({ success: true });
            const response = await client.dryrun('test-data');
            expect(response).toBeDefined();
        });
    });
});
