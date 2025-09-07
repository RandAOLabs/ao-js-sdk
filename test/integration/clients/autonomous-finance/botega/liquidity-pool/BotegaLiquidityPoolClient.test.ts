import { Logger, LogLevel } from "src/utils";
import { BotegaAmmClient } from "../../../../../../src/clients/autonomous-finance/botega/liquidity-pool";

describe("BotegaLiquidityPoolClient Integration Tests", () => {
	let client: BotegaAmmClient;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.DEBUG)
		client = new BotegaAmmClient("3biQvRjIp_9Qz1L9D3SJ9laK4akCkP-8bvAo3pQ6jVI");
		client.setDryRunAsMessage(true)
	});

	// describe("getLPInfo", () => {
	//     it("should return pool info with token details", async () => {
	//         const info = await client.getLPInfo();
	//         Logger.info("Pool Info:", JSON.stringify(info, null, 2));
	//         expect(info).toBeDefined();
	//     });
	// });

	describe("getPrice", () => {
		it("should return price for token A", async () => {
			const info = await client.getLPInfo();
			const price = await client.getPrice(100, info.tokenA);
			Logger.info("Price for 100 Token A:", price);
			expect(typeof price).toBe("number");
			expect(price).toBeGreaterThan(0);
		}, 50000);

		// it("should return price for token B", async () => {
		//     const info = await client.getLPInfo();
		//     const price = await client.getPrice(100, info.tokenB);
		//     Logger.info("Price for 100 Token B:", price);
		//     expect(typeof price).toBe("number");
		//     expect(price).toBeGreaterThan(0);
		// });
	});
});
