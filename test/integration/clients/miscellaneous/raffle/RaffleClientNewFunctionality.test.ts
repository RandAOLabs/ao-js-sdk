import { RaffleClient } from "src/clients";
import { Logger, LogLevel } from "src/utils";

describe("RaffleClient Integration Tests", () => {
    let client: RaffleClient;
    let testUserId: string;
    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)
        client = RaffleClient.autoConfiguration();
        testUserId = await client.getCallingWalletAddress()
    });

    // it("should perform basic raffle operations", async () => {
    //     // Set entrants
    //     const entrants = [
    //         "James Smith", "Mary Johnson", "Robert Williams",
    //         "Patricia Brown", "John Jones", "Jennifer Miller",
    //         "Michael Davis", "Linda Garcia", "William Rodriguez",
    //         "Elizabeth Martinez"
    //     ];
    //     const setResult = await client.setRaffleEntrants(entrants);
    //     Logger.info("Set entrants result:", setResult);

    //     // Pull raffle
    //     const pullResult = await client.pullRaffle();
    //     Logger.info("Pull raffle result:", pullResult);

    //     // View pulls
    //     const pulls = await client.viewUserPulls();
    //     Logger.info("View pulls result:", pulls);

    //     // View most recent pull
    //     const mostRecent = await client.viewMostRecentPull();
    //     Logger.info("Most recent pull:", mostRecent);
    // });

    // it("should view entrants for a specific user", async () => {
    //     const entrants = await client.viewEntrants(testUserId);
    //     Logger.info("View entrants result:", entrants);
    //     // Should print array of names like:
    //     // ['James Smith', 'Mary Johnson', 'Robert Williams', ...]
    // });

    it("should view specific pull for a user", async () => {
        // Get all pulls to find a valid ID
        const { pulls } = await client.viewUserPulls();
        const pullId = "1"

        const pull = await client.viewUserPull(testUserId, pullId);
        Logger.info("View user pull result:", pull);
        // Should print pull details like:
        // { CallbackId: '...', User: '...', Winner: '...', Id: 1 }
    });

    // it("should view all pulls for a user", async () => {
    //     const userPulls = await client.viewUserPulls(testUserId);
    //     Logger.info("View user pulls result:", userPulls);
    //     // Should print array of pulls like:
    //     // { pulls: [{ CallbackId: '...', User: '...', Winner: '...', Id: 1 }, ...] }
    // });

    // it("should view all raffle owners", async () => {
    //     const owners = await client.viewRaffleOwners();
    //     Logger.info("View raffle owners result:", owners);
    //     // Should print array of user IDs like:
    //     // ['ld4ncW8yLSkckjia3cw6qO7silUdEe1nsdiEvMoLg-0', ...]
    // });

});
