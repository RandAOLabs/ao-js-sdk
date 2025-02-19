import { ProviderStakingClient } from "src/clients/randao/provider-staking/ProviderStakingClient";
import { StakingClient } from "src/clients/staking";
import { ProviderDetails } from "src/clients/randao/provider-profile";
import { StakeWithDetailsError, GetStakeError, ProviderUnstakeError } from "src/clients/randao/provider-staking/ProviderStakingError";
import { error } from "console";

jest.mock("src/clients/staking/StakingClient");

describe("ProviderStakingClient", () => {
    let client: ProviderStakingClient;
    const mockStake = jest.fn();
    const mockUnstake = jest.fn();
    const mockDryrun = jest.fn();
    const mockGetFirstMessageDataJson = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock StakingClient methods
        (StakingClient as jest.Mock).mockImplementation(() => ({
            stake: mockStake,
            unstake: mockUnstake,
            dryrun: mockDryrun,
            getFirstMessageDataJson: mockGetFirstMessageDataJson
        }));

        client = ProviderStakingClient.autoConfiguration();
    });

    describe("stakeWithDetails", () => {
        const quantity = "1000";
        const providerDetails: ProviderDetails = {
            name: "Test Provider",
            commission: 10,
            description: "Test Description"
        };

        it("should stake with provider details successfully", async () => {
            mockStake.mockResolvedValue(true);

            const result = await client.stakeWithDetails(quantity, providerDetails);
            expect(result).toBe(true);
            expect(mockStake).toHaveBeenCalledWith(quantity, [{
                name: "ProviderDetails",
                value: JSON.stringify(providerDetails)
            }]);
        });

        it("should handle staking errors", async () => {
            const error = new Error("Stake failed");
            mockStake.mockRejectedValue(error);

            await expect(client.stakeWithDetails(quantity, providerDetails))
                .rejects.toThrow(StakeWithDetailsError);
        });
    });

    describe("getStake", () => {
        const providerId = "test-provider-id";
        const mockStakeInfo = { amount: "1000", timestamp: 123456789 };

        it("should get stake info successfully", async () => {
            mockDryrun.mockResolvedValue({});
            mockGetFirstMessageDataJson.mockReturnValue(mockStakeInfo);

            const result = await client.getStake(providerId);
            expect(result).toEqual(mockStakeInfo);
            expect(mockDryrun).toHaveBeenCalledWith(
                JSON.stringify({ providerId }),
                [{ name: "Action", value: "Get-Provider-Stake" }]
            );
        });

        it("should handle get stake errors", async () => {
            mockDryrun.mockRejectedValue(new GetStakeError("id", new Error("Failed to get stake")));

            await expect(client.getStake(providerId))
                .rejects.toThrow(GetStakeError);
        });
    });

    describe("unstake", () => {
        const providerId = "test-provider-id";

        it("should unstake successfully", async () => {
            mockUnstake.mockResolvedValue(true);

            const result = await client.unstake(providerId);
            expect(result).toBe(true);
        });

        it("should handle unstake errors", async () => {
            mockUnstake.mockRejectedValue(new ProviderUnstakeError(new Error()));

            await expect(client.unstake(providerId))
                .rejects.toThrow(ProviderUnstakeError);
        });
    });
});
