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
});
