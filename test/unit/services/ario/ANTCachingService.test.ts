import { ANTClient } from 'src/clients/ario/ant';
import { ANTCachingService } from 'src/services/ario/ANTCachingService';
import { ARN_ROOT_NAME } from 'src/services/ario/constants';

jest.mock('src/clients/ario/ant');

describe('ANTCachingService', () => {
    let service: ANTCachingService;
    const mockProcessId = 'test-process-id';
    const mockRecords = {
        '@': {
            name: '@',
            transactionId: 'tx-1',
            metadata: {}
        },
        'test': {
            name: 'test',
            transactionId: 'tx-2',
            metadata: {}
        }
    };

    beforeEach(() => {
        // Reset and setup mocks
        jest.clearAllMocks();
        (ANTClient as jest.Mock).mockImplementation(() => ({
            getRecords: jest.fn().mockResolvedValue(mockRecords)
        }));

        service = new ANTCachingService(mockProcessId);
    });

    describe('getRecords', () => {
        it('should fetch and cache records when not in cache', async () => {
            const result = await service.getRecords();

            expect(result).toEqual(mockRecords);
            expect(ANTClient).toHaveBeenCalledWith(mockProcessId);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return data from cache when available', async () => {
            // First call to populate cache
            await service.getRecords();

            // Second call should use cache
            const result = await service.getRecords();

            expect(result).toEqual(mockRecords);
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRecord', () => {
        it('should return specific record by name', async () => {
            const result = await service.getRecord('test');

            expect(result).toEqual(mockRecords['test']);
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return root record when ARN_ROOT_NAME is used', async () => {
            const result = await service.getRecord(ARN_ROOT_NAME);

            expect(result).toEqual(mockRecords['@']);
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return undefined for non-existent record', async () => {
            const result = await service.getRecord('non-existent');

            expect(result).toBeUndefined();
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProcessId', () => {
        it('should return transaction ID for existing record', async () => {
            const result = await service.getProcessId('test');

            expect(result).toBe('tx-2');
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });

        it('should return undefined for non-existent record', async () => {
            const result = await service.getProcessId('non-existent');

            expect(result).toBeUndefined();
            expect(ANTClient).toHaveBeenCalledTimes(1);
            expect((service as any).client.getRecords).toHaveBeenCalledTimes(1);
        });
    });
});
