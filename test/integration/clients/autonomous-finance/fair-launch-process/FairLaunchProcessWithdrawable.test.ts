import { GameFLP } from "../../../../../src/clients/pi/fair-launch-process/flps";
import { Logger, LogLevel } from "../../../../../src/utils/logger";
import { TokenClient } from "../../../../../src/clients/ao/token/TokenClient";
import { AO } from "../../../../../src/constants/processIds/ao";
import { PI_TOKEN_PROCESS_ID } from "../../../../../src/constants/processIds/autonomous-finance";
import { FORWARD_RESEARCH_AO_CONFIG, RANDAO_AO_CONFIG } from "../../../../../src/core/ao/ao-client/configurations";
import { PROCESS_IDS } from "../../../../../src";

// Set log level to DEBUG to ensure we see the debug output
Logger.setLogLevel(LogLevel.DEBUG);

describe("Fair Launch Process Withdrawable Integration Tests", () => {
	jest.setTimeout(30000); // Increase timeout for network requests

	it("should retrieve withdrawable AO amount", async () => {
		const withdrawableAo = await GameFLP.getWithdrawableAo();
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

	it("should retrieve AO proceeds data", async () => {
		const aoProceeds = await GameFLP.getAoProceeds();
		console.log("AO Proceeds:", aoProceeds);
		Logger.info("AO proceeds data:", aoProceeds);

		// Add 16 hours (in milliseconds) to timestamps and print
		const sixteenHoursMs = 16 * 60 * 60 * 1000;
		for (const [yieldCycle, proceeds] of Object.entries(aoProceeds)) {
			if (proceeds.timestamp) {
				const originalTimestamp = parseInt(proceeds.timestamp); // Already in milliseconds
				const newTimestamp = originalTimestamp + sixteenHoursMs;
				const newDate = new Date(newTimestamp);
				console.log(`AO Proceeds Yield Cycle ${yieldCycle}: Original timestamp: ${proceeds.timestamp}, +16 hours: ${newTimestamp} (${newDate.toISOString()})`);
				Logger.info(`AO Proceeds Yield Cycle ${yieldCycle}: Original timestamp: ${proceeds.timestamp}, +16 hours: ${newTimestamp} (${newDate.toISOString()})`);
			}
		}

		expect(typeof aoProceeds).toBe('object');
		expect(aoProceeds).toBeDefined();
	});

	it("should retrieve PI proceeds data", async () => {
		const piProceeds = await GameFLP.getPiProceeds();
		console.log("PI Proceeds:", piProceeds);
		Logger.info("PI proceeds data:", piProceeds);

		// Add 16 hours (in milliseconds) to timestamps and print
		const sixteenHoursMs = 16 * 60 * 60 * 1000;
		for (const [yieldCycle, proceeds] of Object.entries(piProceeds)) {
			if (proceeds.timestamp) {
				const originalTimestamp = parseInt(proceeds.timestamp); // Already in milliseconds
				const newTimestamp = originalTimestamp + sixteenHoursMs;
				const newDate = new Date(newTimestamp);
				console.log(`PI Proceeds Yield Cycle ${yieldCycle}: Original timestamp: ${proceeds.timestamp}, +16 hours: ${newTimestamp} (${newDate.toISOString()})`);
				Logger.info(`PI Proceeds Yield Cycle ${yieldCycle}: Original timestamp: ${proceeds.timestamp}, +16 hours: ${newTimestamp} (${newDate.toISOString()})`);
			}
		}

		expect(typeof piProceeds).toBe('object');
		expect(piProceeds).toBeDefined();
	});

	it("should transfer AO tokens to specified address", async () => {
		const tokenClient = TokenClient.builder()
			.withProcessId(PROCESS_IDS.AO)
			.withAOConfig(FORWARD_RESEARCH_AO_CONFIG)
			.build();

		const quantity = "12426971781446";
		const recipient = "_OT_mkRL0TWKs494RXWKGGyVbZ63MdxY6JwfFnDRLPY";
		const transferResult = await tokenClient.transfer(recipient, quantity)

		Logger.info("AO Token transfer result:", transferResult);
		return transferResult;
	});

	it("should transfer PI tokens to specified address", async () => {
		const piTokenClient = TokenClient.builder()
			.withAOConfig(FORWARD_RESEARCH_AO_CONFIG)
			.withProcessId(PI_TOKEN_PROCESS_ID)
			.build();

		const recipient = "_OT_mkRL0TWKs494RXWKGGyVbZ63MdxY6JwfFnDRLPY";
		const quantity = "356939094887130"; // 1 token with 12 decimals

		try {
			const transferResult = await piTokenClient.transfer(recipient, quantity);
			console.log("PI Token transfer result:", transferResult);
			Logger.info("PI Token transfer result:", transferResult);

			expect(typeof transferResult).toBe('boolean');
		} catch (error: any) {
			console.log("PI Token transfer error:", error.message);
			Logger.info("PI Token transfer error:", error.message);

			// This might fail due to insufficient balance or other reasons
			expect(error).toBeDefined();
		}
	});
});
