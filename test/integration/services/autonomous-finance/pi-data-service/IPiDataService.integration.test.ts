import { lastValueFrom, toArray } from 'rxjs';
import { PiDataService } from 'src/services/autonomous-finance/pi-data-service/PiDataService';
import { Logger, LogLevel } from '../../../../../src';
import { DelegationPreferencesResponseWithBalance, MintReportMessageData } from 'src/services/autonomous-finance/pi-data-service/abstract/responses';

describe('IPiDataService Integration Tests', () => {
    let service: PiDataService;

    beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG)
        service = PiDataService.autoConfiguration();
    });

    it('should get all current delegations with allocations', async () => {
        const allocations = await lastValueFrom(service.getAllPiDelegationPreferences().pipe(toArray()));
        Logger.info(`Found ${allocations.length} allocation responses`);
        if (allocations.length > 0) {
            Logger.info('First Allocation Response:', allocations[0]);
        }
    }, 100000);

    it('should get all current delegations with allocations and balances', async () => {
        const allocationsWithBalances = await lastValueFrom(service.getAllPiDelegationPreferencesWithBalances().pipe(toArray()));
        Logger.info(`Found ${allocationsWithBalances.length} allocation responses with balances`);
        
        // Get first array of allocations
        const allocations = allocationsWithBalances[0];
        if (allocations && allocations.length > 0) {
            const firstAllocation = allocations[0] as DelegationPreferencesResponseWithBalance;
            Logger.info('First Allocation Response with Balance:', firstAllocation);
            
            // Verify balance field exists and is a number
            expect(typeof firstAllocation.balance).toBe('number');
            expect(firstAllocation.balance).toBeGreaterThanOrEqual(0);
            
            // Log balance in both Winston and AR for verification
            Logger.info(`Wallet ${firstAllocation.wallet} balance:`, {
                winston: firstAllocation.balance,
                ar: firstAllocation.balance / 1000000000000
            });
        }
    }, 100000);

	it('getAllPiDelegationMessages', async () => {
        const messages = await lastValueFrom(service.getAllPiDelegationMessages().pipe(toArray()));
        Logger.info(`Found ${messages.length} allocation responses`);
        if (messages.length > 0) {
            Logger.info('First Message Response:', messages[0]);
        }
    }, 100000);

    it('should get all mint report messages', async () => {
        const messages = await lastValueFrom(service.getMintReportMessages().pipe(toArray()));
        const flatMessages = messages.flat();
        Logger.info(`Found ${flatMessages.length} mint report messages`);
        if (flatMessages.length > 0 && flatMessages[0]?.id) {
            Logger.info('First mint report message ID:', flatMessages[0].id);
        }
    }, 100000);

    it('should get mint report message data', async () => {
        const messages = await lastValueFrom(service.getMintReportMessages().pipe(toArray()));
        const flatMessages = messages.flat();
        Logger.info(`Found ${flatMessages.length} mint report messages`);
        
        if (flatMessages.length > 0 && flatMessages[0].id) {
            const firstMessage = flatMessages[0];
            const messageData = await service['arweaveDataService'].getTransactionData<MintReportMessageData>(firstMessage.id!);
            Logger.info(messageData);
        }
    }, 100000);
});
