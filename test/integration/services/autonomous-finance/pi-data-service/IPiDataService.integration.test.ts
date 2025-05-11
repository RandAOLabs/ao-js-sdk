import { lastValueFrom } from 'rxjs';
import { PiDataService } from 'src/services/autonomous-finance/pi-data-service/PiDataService';
import { Logger, LogLevel } from '../../../../../src';

describe('IPiDataService Integration Tests', () => {
    let service: PiDataService;

    beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG)
        service = PiDataService.autoConfiguration();
    });

    it('should get all current delegations with allocations', async () => {
        const allocations = await lastValueFrom(service.getAllPiDelegationPreferences());
        console.log(`Found ${allocations.length} allocation responses`);
        if (allocations.length > 0) {
            console.log('First Allocation Response:', JSON.stringify(allocations[0], null, 2));
        }
    }, 100000);

	it('getAllPiDelegationMessages', async () => {
        const messages = await lastValueFrom(service.getAllPiDelegationMessages());
        console.log(`Found ${messages.length} allocation responses`);
        if (messages.length > 0) {
            console.log('First Message Response:', JSON.stringify(messages[0], null, 2));
        }
    }, 100000);
});
