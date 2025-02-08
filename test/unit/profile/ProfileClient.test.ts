import { ProfileClient } from "../../../src/clients/profile";
import { BaseClient } from "../../../src/core/ao/BaseClient";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { AsyncInitializationRequiredError } from "../../../src/clients/profile/ProfileClientError";

// Mock BaseClient methods
const mockDryRunResult: DryRunResult = {
    Output: undefined,
    Messages: [{
        Data: JSON.stringify({
            Profile: {},
            Assets: [],
            Collections: [],
            Owner: "test-owner"
        }),
        Tags: []
    }],
    Spawns: []
};

const mockMessageResult: MessageResult = {
    Output: undefined,
    Messages: [{ Data: "", Tags: [{ name: "Action", value: "Transfer-Success" }] }],
    Spawns: []
};

jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(mockDryRunResult);
jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(mockMessageResult);
jest.spyOn(BaseClient.prototype, 'getCallingWalletAddress').mockResolvedValue("test-wallet");

// Mock the getProfileClientAutoConfiguration
jest.mock("../../../src/clients/profile/ProfileClientAutoConfiguration", () => ({
    getProfileClientAutoConfiguration: jest.fn().mockResolvedValue({
        processId: "test-process-id",
        wallet: {},
        environment: "node"
    })
}));

describe("ProfileClient Unit Tests", () => {
    let client: ProfileClient;

    beforeAll(async () => {
        client = await ProfileClient.createAutoConfigured();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("constructors", () => {
        it("should throw AsyncInitializationRequiredError when using autoConfiguration", () => {
            // Reset the mock to test actual behavior
            jest.spyOn(ProfileClient, 'autoConfiguration').mockRestore();
            expect(() => ProfileClient.autoConfiguration()).toThrow(AsyncInitializationRequiredError);
        });
    });

    describe("getProfileInfo", () => {

        it("should use provided address", async () => {
            const address = "test-address";
            const dryrunSpy = jest.spyOn(client, 'dryrun');

            await client.getProfileInfo(address);

            expect(dryrunSpy).toHaveBeenCalledWith('', [
                { name: "Action", value: "Info" }
            ]);
        });

        it("should use calling wallet address if none provided", async () => {
            const getWalletSpy = jest.spyOn(client, 'getCallingWalletAddress');

            await client.getProfileInfo();

            expect(getWalletSpy).toHaveBeenCalled();
        });

        it("should return parsed profile info", async () => {
            const result = await client.getProfileInfo();
            expect(result).toBeDefined();
            expect(result.Profile).toBeDefined();
            expect(result.Assets).toBeDefined();
            expect(result.Collections).toBeDefined();
            expect(result.Owner).toBeDefined();
        });
    });

    describe("transferAsset", () => {
        let client: ProfileClient;

        beforeAll(async () => {
            client = await ProfileClient.createAutoConfigured();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should include additional tags if provided", async () => {
            const messageResultSpy = jest.spyOn(client, 'messageResult');
            const additionalTags = [{ name: "Extra", value: "Tag" }];

            await client.transferAsset("asset", "recipient", "1", additionalTags);

            expect(messageResultSpy).toHaveBeenCalledWith('', expect.arrayContaining([
                { name: "Action", value: "Transfer" },
                { name: "Target", value: "asset" },
                { name: "Recipient", value: "recipient" },
                { name: "Quantity", value: "1" },
                { name: "Extra", value: "Tag" }
            ]));
        });

        it("should return true on successful transfer", async () => {
            const result = await client.transferAsset("asset", "recipient", "1");
            expect(result).toBe(true);
        });

        it("should return false on failed transfer", async () => {
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValueOnce({
                Output: undefined,
                Messages: [{ Data: "", Tags: [{ name: "Action", value: "Transfer-Failed" }] }],
                Spawns: []
            });

            const result = await client.transferAsset("asset", "recipient", "1");
            expect(result).toBe(false);
        });
    });
});
