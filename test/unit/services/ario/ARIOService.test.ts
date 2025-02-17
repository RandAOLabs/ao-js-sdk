import { ARIOService } from 'src/services/ario/ARIOService';
import { ANTClient } from 'src/clients/ario/ant';
import { ANTRecord } from 'src/clients/ario/ant/types';
import { ARNSClient } from 'src/clients/ario/arns';
import { ARNSRecord } from 'src/clients/ario/arns/types';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError, InvalidDomainError } from 'src/services/ario/ARIOError';
import { ARN_ROOT_NAME } from 'src/services/ario/constants';

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

        // Setup mocks
        mockArnsClient = {
            getRecord: jest.fn(),
            autoConfiguration: jest.fn(),
        } as any;

        mockAntClient = {
            getRecord: jest.fn(),
        } as any;

        // Mock ARNSClient.autoConfiguration to return our mock
        (ARNSClient as any).autoConfiguration = jest.fn().mockReturnValue(mockArnsClient);

        // Mock ANTClient constructor
        (ANTClient as any).mockImplementation(() => mockAntClient);

        // Create service instance with empty cache config
        service = ARIOService.getInstance({ maxAge: 0 });
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
            expect(ANTClient).toHaveBeenCalledWith(processId);
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
            expect(ANTClient).toHaveBeenCalledWith(processId);
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
            expect(mockArnsClient.getRecord).toHaveBeenCalledWith(domain);
            expect(mockAntClient.getRecord).toHaveBeenCalledWith('nft');
            expect(ANTClient).toHaveBeenCalledWith(processId);
        });

        it('should throw InvalidDomainError for empty domain', async () => {
            await expect(service.getProcessIdForDomain('')).rejects.toThrow(InvalidDomainError);
        });

        it('should throw InvalidDomainError for invalid domain format', async () => {
            await expect(service.getProcessIdForDomain('invalid_name_extra')).rejects.toThrow(InvalidDomainError);
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
