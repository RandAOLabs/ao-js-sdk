import { ARCAO } from "src/processes/ids/arcao";
import { QuanityTheoryService } from "src/services/currency/quantity-theory/QuantityTheoryService";
import { TokenService } from "src/services/token-service/TokenService";
import { Logger, LogLevel } from "src/utils/logger";

describe('QuantityTheoryService Integration Tests', () => {
    let tokenService: TokenService;
    let quantityTheoryService: QuanityTheoryService;

    beforeAll(() => {
        // Set log level to DEBUG to see all logs
        Logger.setLogLevel(LogLevel.DEBUG);
        
        // Create TokenService with GameToken process ID
        tokenService = new TokenService(ARCAO.GAME_TOKEN);
        
        // Create QuantityTheoryService with TokenService
        quantityTheoryService = new QuanityTheoryService(tokenService);
    });

    it('should calculate and log QPVM values for GameToken', async () => {
        // Set a date range for V calculation (last 30 days)
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        quantityTheoryService.setDateRange(fromDate, toDate);

        // Calculate Q, P, V, M values
		const m = await quantityTheoryService.calculateM();
        const q = await quantityTheoryService.calculateQ();
        const p = await quantityTheoryService.calculateP();
        const v = await quantityTheoryService.calculateV();


        // Log the results
        Logger.info('Quantity Theory of Money values for GameToken:');
        Logger.info(`Q (Number of Transactions): ${q.toString()}`);
        Logger.info(`P (Average Price): ${p.toString()}`);
        Logger.info(`V (Velocity of Money): ${v.toString()}`);
        Logger.info(`M (Money Supply): ${m.toString()}`);

        // Simple assertions to ensure values are calculated
        expect(q).toBeDefined();
        expect(p).toBeDefined();
        expect(v).toBeDefined();
        expect(m).toBeDefined();
    }, 60000); // 60s timeout since it's fetching network data
});
