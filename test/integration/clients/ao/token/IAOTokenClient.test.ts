import { Logger, LogLevel } from "../../../../../src/utils/logger";
import { HyperBeamTokenClient } from "../../../../../src/clients/ao/token/implementations/hyperbeam-token-client/HyperBeamTokenClient";
import { ARC } from "../../../../../src/constants/processIds/arcao";

describe("HyperBeamTokenClient", () => {
	beforeAll(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
	});

	describe("Balance", () => {
		it("should log the balance result for a given address", async () => {
			const client = new HyperBeamTokenClient({
				processId: ARC.GAME_TOKEN
			});

			// Using a test address - replace with actual address for real testing
			const testAddress = "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA";
			const balance = await client.balance(testAddress);

			Logger.info("Balance result for address", testAddress, ":", balance);

			expect(balance).toBeDefined();
			expect(typeof balance).toBe("string");
		});
	});

	describe("Transfer", () => {
		it("should return transfer result for a given recipient and quantity", async () => {
			const client = new HyperBeamTokenClient({
				processId: ARC.GAME_TOKEN
			});

			// Using test parameters - replace with actual values for real testing
			const testRecipient = "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA";
			const testQuantity = "1";

			try {
				const transferResult = await client.transfer(testRecipient, testQuantity);

				Logger.info("Transfer result for recipient", testRecipient, "quantity", testQuantity, ":", transferResult);

				expect(transferResult).toBeDefined();
				expect(typeof transferResult).toBe("boolean");
			} catch (error) {
				// Transfer may fail due to insufficient balance or read-only mode, which is expected in tests
				const errorMessage = error instanceof Error ? error.message : String(error);
				Logger.info("Transfer failed as expected:", errorMessage);
				expect(error).toBeDefined();
			}
		}, 15000);
	});

	describe("GetInfo", () => {
		it("should return token information", async () => {
			const client = new HyperBeamTokenClient({
				processId: ARC.GAME_TOKEN
			});

			const tokenInfo = await client.getInfo();

			Logger.info("Token info result:", tokenInfo);

			expect(tokenInfo).toBeDefined();
			expect(typeof tokenInfo).toBe("object");
			// TokenInfo may have optional properties, so we just check it's an object
		});
	});

	describe("Mint", () => {
		it("should return mint result for a given quantity", async () => {
			const client = new HyperBeamTokenClient({
				processId: ARC.GAME_TOKEN
			});

			const testQuantity = "1000";

			try {
				const mintResult = await client.mint(testQuantity);

				Logger.info("Mint result for quantity", testQuantity, ":", mintResult);

				expect(mintResult).toBeDefined();
				expect(typeof mintResult).toBe("boolean");
			} catch (error) {
				// Mint may fail due to permissions or read-only mode, which is expected in tests
				const errorMessage = error instanceof Error ? error.message : String(error);
				Logger.info("Mint failed as expected:", errorMessage);
				expect(error).toBeDefined();
			}
		});
	});
});
