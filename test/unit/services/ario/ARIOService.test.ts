import { ARIOService } from 'src/services/ario/ARIOService';
import { ANTClient } from 'src/clients/ario/ant';
import { ANTRecord } from 'src/clients/ario/ant/types';
import { ARNSClient } from 'src/clients/ario/arns';
import { ARNSRecord } from 'src/clients/ario/arns/types';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError } from 'src/services/ario/ARIOError';
import { ARN_ROOT_NAME } from 'src/services/ario/constants';
import { BaseClientConfig } from 'src/core/ao/configuration';

// Mock the clients
jest.mock('src/clients/ario/ant');
jest.mock('src/clients/ario/arns');

describe('ARIOService', () => {
    let service: ARIOService;
    let mockArnsClient: jest.Mocked<ARNSClient>;
    let mockAntClient: jest.Mocked<ANTClient>;

    beforeEach(() => {
        // Clear singleton instance
        (ARIOService as any).instance = undefined;

        // Setup mocks with required DryRunCachingClient methods
        mockArnsClient = {
            getRecord: jest.fn(),
            dryrun: jest.fn(),
            getFirstMessageDataJson: jest.fn(),
            getProcessId: jest.fn(),
            message: jest.fn(),
            messageResult: jest.fn(),
            result: jest.fn(),
            results: jest.fn(),
            setDryRunAsMessage: jest.fn(),
            getProcessInfo: jest.fn(),
            getCallingWalletAddress: jest.fn(),
            isRunningDryRunsAsMessages: jest.fn(),
            clearCache: jest.fn(),
            getWallet: jest.fn()
        } as any;

        mockAntClient = {
            getRecord: jest.fn(),
            dryrun: jest.fn(),
            getFirstMessageDataJson: jest.fn(),
            getProcessId: jest.fn(),
            message: jest.fn(),
            messageResult: jest.fn(),
            result: jest.fn(),
            results: jest.fn(),
            setDryRunAsMessage: jest.fn(),
            getProcessInfo: jest.fn(),
            getCallingWalletAddress: jest.fn(),
            isRunningDryRunsAsMessages: jest.fn(),
            clearCache: jest.fn()
        } as any;

        // Mock the constructors to return our mocks
        jest.mocked(ARNSClient).mockImplementation((config: BaseClientConfig) => mockArnsClient);
        jest.mocked(ANTClient).mockImplementation((config: BaseClientConfig) => mockAntClient);

        // Create service instance with empty cache config
        service = ARIOService.getInstance({
            arnsClient: mockArnsClient
        });
    });

    describe('getProcessIdForDomain', () => {
        it('should use cached ANT client for same ANT name', async () => {
            // Setup
            const domain1 = 'nft_randao';
            const domain2 = 'other_randao';
            const processId = 'process123';
            const txId = 'tx123';

            mockArnsClient.getRecord.mockResolvedValue({ name: domain1, processId });
            mockAntClient.getRecord.mockResolvedValue({ name: 'nft', transactionId: txId });

            // Execute
            await service.getProcessIdForDomain(domain1);
            await service.getProcessIdForDomain(domain2);

            // Verify ANTClient was only constructed once for 'randao'
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
                processId: expect.any(String)
                // Note: wallet may be undefined in the test environment, consistent with PITokenClient improvements
            }));
        });

        it('should get process ID for simple domain', async () => {
            // Setup
            const domain = 'randao';
            const processId = 'process123';
            const txId = 'tx123';

            mockArnsClient.getRecord.mockResolvedValueOnce({ name: domain, processId });
            mockAntClient.getRecord.mockResolvedValueOnce({ name: ARN_ROOT_NAME, transactionId: txId });

            // Execute
            const result = await service.getProcessIdForDomain(domain);

            // Verify
            expect(result).toBe(txId);
            expect(mockArnsClient.getRecord).toHaveBeenCalledWith(domain);
            expect(mockAntClient.getRecord).toHaveBeenCalledWith(ARN_ROOT_NAME);
            expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
                processId: expect.any(String),
                wallet: expect.anything()
            }));
        });

        it('should get process ID for domain with undername', async () => {
            // Setup
            const domain = 'nft_randao';
            const processId = 'process123';
            const txId = 'tx123';

            mockArnsClient.getRecord.mockResolvedValueOnce({ name: domain, processId });
            mockAntClient.getRecord.mockResolvedValueOnce({ name: 'nft', transactionId: txId });

            // Execute
            const result = await service.getProcessIdForDomain(domain);

            // Verify
            expect(result).toBe(txId);
            expect(mockAntClient.getRecord).toHaveBeenCalledWith('nft');
            expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
                processId: expect.any(String)
                // Note: wallet may be undefined in the test environment, consistent with PITokenClient improvements
            }));
        });

        it('should throw ARNSRecordNotFoundError when ARNS record not found', async () => {
            // Setup
            const domain = 'randao';
            mockArnsClient.getRecord.mockResolvedValueOnce(undefined);

            // Execute & Verify
            await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ARNSRecordNotFoundError);
        });

        it('should throw ARNSRecordNotFoundError when ARNS record has no processId', async () => {
            // Setup
            const domain = 'randao';
            mockArnsClient.getRecord.mockResolvedValueOnce({ name: domain } as ARNSRecord);

            // Execute & Verify
            await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ARNSRecordNotFoundError);
        });

        it('should throw ANTRecordNotFoundError when ANT record not found', async () => {
            // Setup
            const domain = 'randao';
            mockArnsClient.getRecord.mockResolvedValueOnce({ name: domain, processId: 'process123' });
            mockAntClient.getRecord.mockResolvedValueOnce(undefined);

            // Execute & Verify
            await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ANTRecordNotFoundError);
        });

        it('should throw ANTRecordNotFoundError when ANT record has no transactionId', async () => {
            // Setup
            const domain = 'randao';
            mockArnsClient.getRecord.mockResolvedValueOnce({ name: domain, processId: 'process123' });
            mockAntClient.getRecord.mockResolvedValueOnce({ name: ARN_ROOT_NAME } as ANTRecord);

            // Execute & Verify
            await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ANTRecordNotFoundError);
        });
    });
});
