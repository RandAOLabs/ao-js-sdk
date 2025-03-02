import { Tags } from "src/core";
import { TOKENS } from "src/clients"
import { CreditNoticeService } from "src/services/credit-notices";
import { Logger, LogLevel } from "src/utils";

describe('CreditNoticeService Integration Tests', () => {
    let service: CreditNoticeService;

    beforeAll(() => {
        Logger.setLogLevel(LogLevel.DEBUG)
        service = new CreditNoticeService();
    });

    it('should get all credit notices received by an address', async () => {
        const testRecipientId = "j7NcraZUL6GZlgdPEoph12Q5rk_dydvQDecLNxYi8rI";

        const nabTags: Tags = [{ name: 'From-Process', value: TOKENS.NUMBER_ALWAYS_BIGGER }];
        const result = await service.getAllCreditNoticesReceivedById({ recipientId: testRecipientId, additionalTags: nabTags });

        // Log the result for inspection
        Logger.info(`Credit notices received by ${testRecipientId}: ${result.length}`);
        if (result.length > 0) {
            Logger.info(`First credit notice: ${JSON.stringify(result[0], null, 2)}`);
        }

        // Verify the response
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
    }, 60000); // 60s timeout since it's fetching network data

    // it('should get credit notices from a specific process', async () => {
    //     const testRecipientId = "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA";
    //     const testTokenId = "5ZR9uegKoEhE9fJMbs-MvWLIztMNCVxgpzfeBVE3vqI";

    //     const result = await service.getCreditNoticesFromProcess(
    //         testRecipientId,
    //         testTokenId
    //     );

    //     // Log the result for inspection
    //     Logger.info(`Credit notices from process ${testTokenId} received by ${testRecipientId}: ${result.length}`);
    //     if (result.length > 0) {
    //         Logger.info(`First credit notice: ${JSON.stringify(result[0], null, 2)}`);
    //     }

    //     // Verify the response
    //     expect(result).toBeDefined();
    //     expect(result).toBeInstanceOf(Array);
    //     // Each notice should have the correct fromProcess value
    //     result.forEach(notice => {
    //         expect(notice.fromProcess).toBe(testTokenId);
    //     });
    // }, 60000); // 60s timeout since it's fetching network data
});
