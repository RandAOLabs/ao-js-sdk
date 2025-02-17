import { ARNSClient } from 'src/clients/ario/arns';
import { ArnsCashingService } from 'src/services/ario/ARNCachingService';

jest.mock('src/clients/ario/arns');

describe('ArnsCashingService', () => {
    let service: ArnsCashingService;
    const mockData = {
        name: 'test.ar',
        processId: 'test-process-id',
        metadata: {}
    };

    beforeEach(() => {
        // Reset and setup mocks
        jest.clearAllMocks();
        (ARNSClient.autoConfiguration as jest.Mock).mockReturnValue({
            getRecord: jest.fn().mockResolvedValue(mockData)
        });

        service = new ArnsCashingService();
    });

    it('should return data from cache when available', async () => {
        // First call to populate cache
        await service.getArNSRecord({ name: 'test.ar' });

        // Second call should use cache
        const result = await service.getArNSRecord({ name: 'test.ar' });

        expect(result).toEqual(mockData);
        expect(ARNSClient.autoConfiguration).toHaveBeenCalledTimes(1);
        expect((service as any).client.getRecord).toHaveBeenCalledTimes(1);
    });

    it('should fetch and cache data when not in cache', async () => {
        const result = await service.getArNSRecord({ name: 'test.ar' });

        expect(result).toEqual(mockData);
        expect(ARNSClient.autoConfiguration).toHaveBeenCalledTimes(1);
        expect((service as any).client.getRecord).toHaveBeenCalledWith('test.ar');
    });
});
