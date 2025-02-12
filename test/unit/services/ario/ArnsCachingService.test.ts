import { ARIO } from '@ar.io/sdk';
import { ArnsCashingService } from 'src/services/ario/ARNCachingService';

// Mock ARIO
jest.mock('@ar.io/sdk', () => ({
    ARIO: {
        init: jest.fn().mockReturnValue({
            getArNSRecord: jest.fn()
        })
    }
}));

describe('ArnCashingService', () => {
    let service: ArnsCashingService;
    const mockData = {
        name: 'test.ar'
    };
    let mockGetArNSRecord: jest.Mock;

    beforeEach(() => {
        service = new ArnsCashingService();
        const mockArio = ARIO.init();
        mockGetArNSRecord = mockArio.getArNSRecord as jest.Mock;
        mockGetArNSRecord.mockResolvedValue(mockData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return data from cache when available', async () => {
        // First call to populate cache
        await service.getArNSRecord({ name: 'test.ar' });

        // Second call should use cache
        const result = await service.getArNSRecord({ name: 'test.ar' });

        expect(result).toEqual(mockData);
        expect(mockGetArNSRecord).toHaveBeenCalledTimes(1);
    });

    it('should fetch and cache data when not in cache', async () => {
        const result = await service.getArNSRecord({ name: 'test.ar' });

        expect(result).toEqual(mockData);
        expect(mockGetArNSRecord).toHaveBeenCalledTimes(1);
        expect(mockGetArNSRecord).toHaveBeenCalledWith({ name: 'test.ar' });
    });
});
