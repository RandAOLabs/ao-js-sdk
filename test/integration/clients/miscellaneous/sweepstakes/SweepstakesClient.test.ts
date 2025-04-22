import { SweepstakesClient } from "src/clients";
import { Logger, LogLevel } from "src/utils";

describe("SweepstakesClient Integration Tests", () => {
    let client: SweepstakesClient;
    let testUserId: string;
    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)
        client = await SweepstakesClient.autoConfiguration();
        testUserId = await client.getCallingWalletAddress()
    });

	it("should be able to create a sweepstakes", async () => {
        const entrants = [
            "James Smith", "Mary Johnson", "Robert Williams",
            "Patricia Brown", "John Jones", "Jennifer Miller",
            "Michael Davis", "Linda Garcia", "William Rodriguez",
            "Elizabeth Martinez"
        ];
		const result = await client.registerSweepstakes(entrants)
		Logger.info("Create sweepstakes result:", result)
	})

    it("should perform basic sweepstakes operations", async () => {
        // Set entrants
		const entrants = ["Tom", "Dick", "Harry"]
        const setResult = await client.setSweepstakesEntrants(entrants);
        Logger.info("Set entrants result:", setResult);

        // Pull raffle
        const pullResult = await client.pullSweepstakes();
        Logger.info("Pull sweepstakes result:", pullResult);

        // View pulls
        const pulls = await client.viewUserSweepstakesPulls(testUserId);
        Logger.info("View pulls result:", pulls);

    });

    it("should view entrants for a specific user", async () => {
        const entrants = await client.viewSweepstakesEntrants(testUserId);
        Logger.info("View entrants result:", entrants);
        // Should print array of names like:
        // ['James Smith', 'Mary Johnson', 'Robert Williams', ...]
    });

	it("should view all sweepstakes owners", async () => {
		const owners = await client.viewSweepstakesOwners()
		Logger.info("View sweepstakes owners result:", owners)
	});

	it("should see single pull for a user", async () => {
		const pull = await client.viewUserSweepstakesPull(testUserId, "1")
		Logger.info("View user pull result:", pull)
	});

	it("should view all pulls for a user", async () => {
		const userPulls = await client.viewUserSweepstakesPulls(testUserId);
		Logger.info("View user pulls result:", userPulls);
	});
});
