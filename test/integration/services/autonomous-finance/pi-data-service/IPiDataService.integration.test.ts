import { lastValueFrom, toArray } from 'rxjs';
import { PiDataService } from 'src/services/autonomous-finance/pi-data-service/PiDataService';
import { Logger, LogLevel } from '../../../../../src';
import { DelegationPreferencesResponseWithBalance } from 'src/services/autonomous-finance/pi-data-service/abstract/responses';

describe('IPiDataService Integration Tests', () => {
    let service: PiDataService;

    beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG)
        service = PiDataService.autoConfiguration();
    });

    it('should get all current delegations with allocations', async () => {
        const allocations = await lastValueFrom(service.getAllPiDelegationPreferences().pipe(toArray()));
        console.log(`Found ${allocations.length} allocation responses`);
        if (allocations.length > 0) {
            console.log('First Allocation Response:', JSON.stringify(allocations[0], null, 2));
        }
    }, 100000);

    it('should get all current delegations with allocations and balances', async () => {
        const allocationsWithBalances = await lastValueFrom(service.getAllPiDelegationPreferencesWithBalances().pipe(toArray()));
        console.log(`Found ${allocationsWithBalances.length} allocation responses with balances`);
        
        // Get first array of allocations
        const allocations = allocationsWithBalances[0];
        if (allocations && allocations.length > 0) {
            const firstAllocation = allocations[0] as DelegationPreferencesResponseWithBalance;
            console.log('First Allocation Response with Balance:', JSON.stringify(firstAllocation, null, 2));
            
            // Verify balance field exists and is a number
            expect(typeof firstAllocation.balance).toBe('number');
            expect(firstAllocation.balance).toBeGreaterThanOrEqual(0);
            
            // Log balance in both Winston and AR for verification
            console.log(`Wallet ${firstAllocation.wallet} balance:`, {
                winston: firstAllocation.balance,
                ar: firstAllocation.balance / 1000000000000
            });
        }
    }, 100000);

	it('getAllPiDelegationMessages', async () => {
        const messages = await lastValueFrom(service.getAllPiDelegationMessages().pipe(toArray()));
        console.log(`Found ${messages.length} allocation responses`);
        if (messages.length > 0) {
            console.log('First Message Response:', JSON.stringify(messages[0], null, 2));
        }
    }, 100000);

    it('should get all mint report messages', async () => {
        const messages = await lastValueFrom(service.getMintReportMessages().pipe(toArray()));
        const flatMessages = messages.flat();
        console.log(`Found ${flatMessages.length} mint report messages`);
        if (flatMessages.length > 0) {
            console.log('First mint report message ID:', flatMessages[0].id);
        }
    }, 100000);
});
