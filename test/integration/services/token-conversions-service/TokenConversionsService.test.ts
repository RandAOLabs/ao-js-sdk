import { CurrencyAmount, TokenBalance } from "../../../../src/models";
import { ITokenConversionsService, TokenConversionsService } from "../../../../src/services/token-conversions-service";
import { Logger, LogLevel } from "../../../../src/utils/logger";


describe("TokenConversionsService Integration Tests", () => {
	let service: ITokenConversionsService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = TokenConversionsService.autoConfiguration();
		Logger.debug("TokenConversionsService test initialized");
	});

	it("should convert token balance from one token to another and print results", async () => {

		const tokenProcessIdA = "s6jcB3ctSbiDNwR-paJgy5iOAhahXahLul8exSLHbGE";
		const tokenProcessIdB = "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc";

		const sourceTokenBalance = new TokenBalance({
			currencyAmount: CurrencyAmount.fromDecimal("1", 18),
			tokenConfig: {
				name: "GAME",
				tokenProcessId: tokenProcessIdA,
				logoTxId: "test-logo-tx-id"
			}
		});

		const targetTokenProcessId = tokenProcessIdB
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
