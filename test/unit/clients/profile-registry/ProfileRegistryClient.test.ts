import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { ProfileRegistryClient } from "src/clients";
import { BaseClient } from "src/core/ao/BaseClient";
import { getWalletLazy } from "src/utils";


// Mock BaseClient methods
const mockDryRunResult: DryRunResult = {
    Output: undefined,
    Messages: [{ Data: JSON.stringify([{ CallerAddress: "test", ProfileId: "test", Role: "test" }]), Tags: [] }],
    Spawns: []
};

jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(mockDryRunResult);
jest.spyOn(BaseClient.prototype, 'getCallingWalletAddress').mockResolvedValue("test-wallet");

// // Mock the getProfileRegistryClientAutoConfiguration
// jest.mock("src/clients/bazar/profile-registry/ProfileRegistryClientAutoConfiguration", () => ({
//     getProfileRegistryClientAutoConfiguration: () => ({
//         processId: "test-process-id",
//         wallet: getWalletLazy(),
//         environment: "node"
//     })
// }));

describe("ProfileRegistryClient Unit Tests", () => {
    let client: ProfileRegistryClient;

    beforeAll(() => {
        client = ProfileRegistryClient.autoConfiguration();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getProfileByWalletAddress", () => {
        it("should use provided wallet address", async () => {
            const walletAddress = "test-address";
            const dryrunSpy = jest.spyOn(client, 'dryrun');

            await client.getProfileByWalletAddress(walletAddress);

            expect(dryrunSpy).toHaveBeenCalledWith(
                JSON.stringify({ Address: walletAddress }),
                expect.arrayContaining([
                    expect.objectContaining({
                        name: "Action",
                        value: "Get-Profiles-By-Delegate"
                    })
                ])
            );
        });

        it("should use calling wallet address if none provided", async () => {
            const dryrunSpy = jest.spyOn(client, 'dryrun');
            const getWalletSpy = jest.spyOn(client, 'getCallingWalletAddress');

            await client.getProfileByWalletAddress();

            expect(getWalletSpy).toHaveBeenCalled();
            expect(dryrunSpy).toHaveBeenCalledWith(
                JSON.stringify({ Address: "test-wallet" }),
                expect.any(Array)
            );
        });

        it("should return parsed profile registry entries", async () => {
            const result = await client.getProfileByWalletAddress();
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });
});
