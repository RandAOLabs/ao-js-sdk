import { TokenConversionsService } from "src/services/token-conversions-service/TokenConversionsService";
import { ITokenConversionsService } from "src/services/token-conversions-service/abstract/ITokenConversionsService";
import { Logger, LogLevel } from "src/utils/logger";
import { TokenBalance } from "src/models/token-balance/TokenBalance";
import { CurrencyAmount } from "src/models/currency/CurrencyAmount";
import { COMMUNITY_TOKENS } from "src/constants/processIds/community_tokens";

describe("TokenConversionsService Integration Tests", () => {
	let service: ITokenConversionsService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = TokenConversionsService.autoConfiguration();
		Logger.debug("TokenConversionsService test initialized");
	});

	it("should convert token balance from one token to another and print results", async () => {
		// Create a test token balance for TRUNK token
		const sourceTokenBalance = new TokenBalance({
			currencyAmount: CurrencyAmount.fromDecimal("100", 12), // 100 TRUNK tokens with 12 decimals
			tokenConfig: {
				name: "TRUNK",
				tokenProcessId: COMMUNITY_TOKENS.TRUNK,
				logoTxId: "test-logo-tx-id"
			}
		});

		// Target token to convert to (LLAMA)
		const targetTokenProcessId = COMMUNITY_TOKENS.LLAMA;

		Logger.info(`Testing convert from TRUNK to LLAMA`);
		Logger.info(`Source token balance: ${sourceTokenBalance.toString()}`);
		Logger.info(`Target token process ID: ${targetTokenProcessId}`);

		try {
			const convertedBalance = await service.convert(sourceTokenBalance, targetTokenProcessId);

			Logger.info(`Conversion successful!`);
			Logger.info(`Converted balance: ${convertedBalance.toString()}`);
			Logger.info(`Source amount: ${sourceTokenBalance.getCurrencyAmount().toString()}`);
			Logger.info(`Converted amount: ${convertedBalance.getCurrencyAmount().toString()}`);
			Logger.info(`Target token config: ${JSON.stringify(convertedBalance.getTokenConfig())}`);

			// Basic assertions
			expect(convertedBalance).toBeDefined();
			expect(convertedBalance.getTokenConfig().tokenProcessId).toBe(targetTokenProcessId);
			expect(convertedBalance.getCurrencyAmount().isPositive()).toBe(true);

		} catch (error) {
			Logger.error('Error during token conversion:', error);
			throw error;
		}

	}, 300000); // 5 minute timeout

});
