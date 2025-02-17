import { ANT, AoANTRead } from '@ar.io/sdk';
import { ANTCachingService } from 'src/services/ario/ANTCachingService';
import { ARN_ROOT_NAME } from 'src/services/ario/constants';
import { getANT } from 'src/services/ario/ario';

jest.mock('src/services/ario/ario');

describe('ANTCachingService', () => {
    let service: ANTCachingService;
    const mockProcessId = 'test-process-id';
    const mockRecords = {
        '@': {
            name: '@',
            transactionId: 'tx-1'
        },
        'test': {
            name: 'test',
            transactionId: 'tx-2'
        }
    };
    let mockAnt: jest.Mocked<AoANTRead>;

    beforeEach(() => {
        mockAnt = {
            getRecords: jest.fn().mockResolvedValue(mockRecords)
        } as any;

        (getANT as jest.Mock).mockResolvedValue(mockAnt);
        service = new ANTCachingService(mockProcessId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecords', () => {
        it('should fetch and cache records when not in cache', async () => {
            const result = await service.getRecords();

            expect(result).toEqual(mockRecords);
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return data from cache when available', async () => {
            // First call to populate cache
            await service.getRecords();

            // Second call should use cache
            const result = await service.getRecords();

            expect(result).toEqual(mockRecords);
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRecord', () => {
        it('should return specific record by name', async () => {
            const result = await service.getRecord('test');

            expect(result).toEqual(mockRecords['test']);
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return root record when ARN_ROOT_NAME is used', async () => {
            const result = await service.getRecord(ARN_ROOT_NAME);

            expect(result).toEqual(mockRecords['@']);
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return undefined for non-existent record', async () => {
            const result = await service.getRecord('non-existent');

            expect(result).toBeUndefined();
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProcessId', () => {
        it('should return transaction ID for existing record', async () => {
            const result = await service.getProcessId('test');

            expect(result).toBe('tx-2');
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return undefined for non-existent record', async () => {
            const result = await service.getProcessId('non-existent');

            expect(result).toBeUndefined();
            expect(getANT).toHaveBeenCalledTimes(1);
            expect(mockAnt.getRecords).toHaveBeenCalledTimes(1);
        });
    });
});
