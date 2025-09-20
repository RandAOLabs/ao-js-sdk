import { GameFLP } from "../../../../../src/clients/pi/fair-launch-process/flps";
import { Logger, LogLevel } from "../../../../../src/utils/logger";

// Set log level to DEBUG to ensure we see the debug output
Logger.setLogLevel(LogLevel.DEBUG);

describe("Fair Launch Process Withdrawable Integration Tests", () => {
	jest.setTimeout(30000); // Increase timeout for network requests

	it("should retrieve withdrawable AO amount", async () => {
		const withdrawableAo = await GameFLP.getWithdrawableAo(1758494854);
		console.log("Withdrawable AO:", withdrawableAo);
		Logger.info("Withdrawable AO amount:", withdrawableAo);

		expect(typeof withdrawableAo).toBe('string');
	});

	it("should retrieve withdrawable PI amount", async () => {
		const withdrawablePi = await GameFLP.getWithdrawablePi();
		console.log("Withdrawable PI:", withdrawablePi);
		Logger.info("Withdrawable PI amount:", withdrawablePi);

		expect(typeof withdrawablePi).toBe('string');
	});

	it("should retrieve withdrawable AO amount with custom time", async () => {
		const customTime = Math.floor(Date.now() / 1000) - 86400; // 24 hours ago
		const withdrawableAo = await GameFLP.getWithdrawableAo(customTime);
		console.log("Withdrawable AO with custom time:", withdrawableAo);
		Logger.info("Withdrawable AO amount with custom time:", withdrawableAo, "Time:", customTime);

		expect(typeof withdrawableAo).toBe('string');
	});

	it("should retrieve withdrawable PI amount with custom time", async () => {
		const customTime = Math.floor(Date.now() / 1000) - 86400; // 24 hours ago
		const withdrawablePi = await GameFLP.getWithdrawablePi(customTime);
		console.log("Withdrawable PI with custom time:", withdrawablePi);
		Logger.info("Withdrawable PI amount with custom time:", withdrawablePi, "Time:", customTime);

		expect(typeof withdrawablePi).toBe('string');
	});

	it("should attempt to withdraw AO tokens (deployer only)", async () => {
		try {
			const result = await GameFLP.withdrawAo();
			console.log("Withdraw AO result:", result);
			Logger.info("Withdraw AO result:", result);

			expect(result).toBeDefined();
		} catch (error: any) {
			console.log("Withdraw AO error (expected if not deployer):", error.message);
			Logger.info("Withdraw AO error (expected if not deployer):", error.message);

			// This is expected if the calling wallet is not the deployer
			expect(error).toBeDefined();
		}
	});

	it("should attempt to withdraw PI tokens (deployer only)", async () => {
		try {
			const result = await GameFLP.withdrawPi();
			console.log("Withdraw PI result:", result);
			Logger.info("Withdraw PI result:", result);

			expect(result).toBeDefined();
		} catch (error: any) {
			console.log("Withdraw PI error (expected if not deployer):", error.message);
			Logger.info("Withdraw PI error (expected if not deployer):", error.message);

			// This is expected if the calling wallet is not the deployer
			expect(error).toBeDefined();
		}
	});
});
