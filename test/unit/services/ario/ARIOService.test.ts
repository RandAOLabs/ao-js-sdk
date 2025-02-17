import { ARIOService } from 'src/services/ario/ARIOService';
import { ANTRecordNotFoundError, ARNSRecordNotFoundError, InvalidDomainError } from 'src/services/ario/ARIOError';
import { ArnsCashingService } from 'src/services/ario/ARNCachingService';
import { ANTCachingService } from 'src/services/ario/ANTCachingService';
import { Domain } from 'src/services/ario/domains';

jest.mock('src/services/ario/ARNCachingService');
jest.mock('src/services/ario/ANTCachingService');

describe('ARIOService', () => {
    let service: ARIOService;
    const mockArnsRecord = {
        name: 'test_domain',
        processId: 'arns-process-id',
        metadata: {}
    };
    const mockAntRecord = {
        name: 'test',
        transactionId: 'ant-process-id',
        metadata: {}
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock ARNS service
        (ArnsCashingService as jest.Mock).mockImplementation(() => ({
            getArNSRecord: jest.fn().mockResolvedValue(mockArnsRecord)
        }));

        // Mock ANT service
        (ANTCachingService as jest.Mock).mockImplementation(() => ({
            getProcessId: jest.fn().mockResolvedValue(mockAntRecord.transactionId)
        }));

        service = ARIOService.getInstance();
    });

    describe('getInstance', () => {
        it('should return the same instance when called multiple times', () => {
            const instance1 = ARIOService.getInstance();
            const instance2 = ARIOService.getInstance();
            expect(instance1).toBe(instance2);
        });

        it('should return the same instance even with different configs', () => {
            const instance1 = ARIOService.getInstance();
            const instance2 = ARIOService.getInstance({ maxAge: 1000 });
            expect(instance1).toBe(instance2);
        });
    });

    describe('getProcessIdForDomain', () => {
        it('should resolve process ID for a valid domain', async () => {
            const processId = await service.getProcessIdForDomain('test_domain');
            expect(processId).toBe(mockAntRecord.transactionId);
        });

        it('should resolve process ID for a Domain enum value', async () => {
            const processId = await service.getProcessIdForDomain(Domain.RANDAO_API);
            expect(processId).toBe(mockAntRecord.transactionId);
        });

        it('should throw InvalidDomainError for empty domain', async () => {
            await expect(service.getProcessIdForDomain('')).rejects.toThrow(InvalidDomainError);
        });

        it('should throw InvalidDomainError for malformed domain', async () => {
            await expect(service.getProcessIdForDomain('test_domain_extra')).rejects.toThrow(InvalidDomainError);
        });

        it('should throw ARNSRecordNotFoundError when ARNS record is missing', async () => {
            (ArnsCashingService as jest.Mock).mockImplementation(() => ({
                getArNSRecord: jest.fn().mockResolvedValue(undefined)
            }));
            await expect(service.getProcessIdForDomain('test_domain')).rejects.toThrow(ARNSRecordNotFoundError);
        });

        it('should throw ANTRecordNotFoundError when ANT record is missing', async () => {
            (ANTCachingService as jest.Mock).mockImplementation(() => ({
                getProcessId: jest.fn().mockResolvedValue(undefined)
            }));
            await expect(service.getProcessIdForDomain('test_domain')).rejects.toThrow(ANTRecordNotFoundError);
        });
    });
});
