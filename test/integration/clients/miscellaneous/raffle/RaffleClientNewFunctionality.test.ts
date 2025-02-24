import { RaffleClient } from "src/clients/miscellaneous/raffle";
import { Logger } from "src/utils";

describe("RaffleClient Integration Tests", () => {
    let client: RaffleClient;
    const testUserId = "ld4ncW8yLSkckjia3cw6qO7silUdEe1nsdiEvMoLg-0";

    beforeAll(() => {
        client = RaffleClient.autoConfiguration();
    });

    it("should perform basic raffle operations", async () => {
        // Set entrants
        const entrants = [
            "James Smith", "Mary Johnson", "Robert Williams",
            "Patricia Brown", "John Jones", "Jennifer Miller",
            "Michael Davis", "Linda Garcia", "William Rodriguez",
            "Elizabeth Martinez"
        ];
        const setResult = await client.setRaffleEntrants(entrants);
        Logger.info("Set entrants result:", setResult);

        // Pull raffle
        const pullResult = await client.pullRaffle();
        Logger.info("Pull raffle result:", pullResult);

        // View pulls
        const pulls = await client.viewPulls();
        Logger.info("View pulls result:", pulls);

        // View most recent pull
        const mostRecent = await client.viewMostRecentPull();
        Logger.info("Most recent pull:", mostRecent);
    });

    it("should view entrants for a specific user", async () => {
        const entrants = await client.viewEntrants(testUserId);
        Logger.info("View entrants result:", entrants);
        // Should print array of names like:
        // ['James Smith', 'Mary Johnson', 'Robert Williams', ...]
    });

    it("should view specific pull for a user", async () => {
        // First do a pull to ensure we have data
        await client.pullRaffle();

        // Get all pulls to find a valid ID
        const { pulls } = await client.viewPulls();
        const pullId = pulls[0]?.Id.toString() || "1";

        const pull = await client.viewUserPull(testUserId, pullId);
        Logger.info("View user pull result:", pull);
        // Should print pull details like:
        // { CallbackId: '...', User: '...', Winner: '...', Id: 1 }
    });

    it("should view all pulls for a user", async () => {
        const userPulls = await client.viewUserPulls(testUserId);
        Logger.info("View user pulls result:", userPulls);
        // Should print array of pulls like:
        // { pulls: [{ CallbackId: '...', User: '...', Winner: '...', Id: 1 }, ...] }
    });

    it("should view all raffle owners", async () => {
        const owners = await client.viewRaffleOwners();
        Logger.info("View raffle owners result:", owners);
        // Should print array of user IDs like:
        // ['ld4ncW8yLSkckjia3cw6qO7silUdEe1nsdiEvMoLg-0', ...]
    });

    it("should perform multiple operations in sequence", async () => {
        // Set new entrants
        const entrants = [
            "Julie Bell", "Jason Nelson", "Stephanie Harper",
            "Kevin Lewis", "Rachel Turner"
        ];
        await client.setRaffleEntrants(entrants);

        // Do multiple pulls
        await client.pullRaffle();
        await client.pullRaffle();
        await client.pullRaffle();

        // View all pulls for the user
        const userPulls = await client.viewUserPulls(testUserId);
        Logger.info("User pulls after multiple operations:", userPulls);

        // View the entrants
        const currentEntrants = await client.viewEntrants(testUserId);
        Logger.info("Current entrants:", currentEntrants);

        // View a specific pull
        if (userPulls.pulls.length > 0) {
            const specificPull = await client.viewUserPull(testUserId, userPulls.pulls[0].Id.toString());
            Logger.info("Specific pull details:", specificPull);
        }
    });
});
