import { RaffleClient, RafflePull } from "src/clients";
import { ViewPullError } from "src/clients/miscellaneous/raffle/RaffleClientError";
import { Logger, LogLevel } from "src/utils";
import { MockBaseClient } from "test/unit/clients/MockBaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { ClientError } from "src/clients/common/ClientError";

describe("RaffleClient Unit Tests", () => {
    let mockBaseClient: MockBaseClient;
    let client: RaffleClient;

    beforeEach(() => {
        Logger.setLogLevel(LogLevel.NONE)
        // Logger.setLogLevel(LogLevel.DEBUG)
        mockBaseClient = new MockBaseClient();
        client = RaffleClient.autoConfiguration()
        mockBaseClient.bindToClient(client);
        jest.spyOn(ResultUtils, 'getFirstMessageDataJson').mockReset();
    });

    describe("viewMostRecentPull", () => {
        it("should return pull with highest ID", async () => {
            // Setup mock data
            const mockPulls = [
                { Id: 1, CallbackId: "1", User: "user1" },
                { Id: 3, CallbackId: "3", User: "user3" },
                { Id: 2, CallbackId: "2", User: "user2" }
            ];
            jest.spyOn(ResultUtils, 'getFirstMessageDataJson').mockReturnValueOnce(mockPulls);

            const result = await client.viewMostRecentPull();
            expect(result.Id).toBe(3);
            expect(result.User).toBe("user3");
        });

        it("should throw error when no pulls exist", async () => {
            const emptyPulls = { pulls: [] };
            jest.spyOn(ResultUtils, 'getFirstMessageDataJson').mockReturnValueOnce(emptyPulls);

            await expect(client.viewMostRecentPull())
                .rejects
                .toThrow(ClientError);
        });
    });
});
