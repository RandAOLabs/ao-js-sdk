import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ProviderProfileClient } from "src/clients/randao/provider-profile/ProviderProfileClient";
import { ProviderDetails, ProviderInfoDTO } from "src/clients/randao/provider-profile/abstract/types";
import { BaseClient } from "src/core/ao/BaseClient";

jest.mock("src/services/ario/ARIOService", () => ({
    getProcessIdForDomain: jest.fn().mockResolvedValue("test-process-id")
}));

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
    Output: undefined,
    Messages: [{ Data: "test-message", Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

const mockProviderInfoDTO: ProviderInfoDTO = {
    provider_id: "test-provider",
    provider_details: JSON.stringify({ name: "Test Provider", description: "Test Description" }),
    stake: JSON.stringify({ amount: "1000" }),
    created_at: Date.now()
}

const dryRunResult: DryRunResult = {
    Output: undefined,
    Messages: [{ Data: JSON.stringify(mockProviderInfoDTO), Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
jest.spyOn(BaseClient.prototype, 'getCallingWalletAddress').mockResolvedValue("test-wallet");

describe("ProviderProfileClient Unit Test", () => {
    let client: ProviderProfileClient;

    beforeAll(async () => {
        client = await ProviderProfileClient.autoConfiguration();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("updateDetails()", () => {
        it("should properly stringify provider details in message data", async () => {
            const mockDetails: ProviderDetails = {
                name: "Test Provider",
                description: "Test Description"
            };

            const messageSpy = jest.spyOn(BaseClient.prototype, 'messageResult');
            
            await client.updateDetails(mockDetails);

            // Verify the data was properly stringified (double JSON.stringify for nested objects)
            expect(messageSpy).toHaveBeenCalledWith(
                JSON.stringify({ providerDetails: JSON.stringify(mockDetails) }),
                expect.any(Array)
            );
        });

        it("should clear cache after successful update", async () => {
            const mockDetails: ProviderDetails = {
                name: "Test Provider",
                description: "Test Description"
            };

            const clearCacheSpy = jest.spyOn(client as any, 'clearCache');
            
            await client.updateDetails(mockDetails);

            expect(clearCacheSpy).toHaveBeenCalled();
        });
    });

    describe("getAllProvidersInfo()", () => {
        it("should properly parse multiple provider DTOs", async () => {
            const mockProviderDTOs = [
                {
                    provider_id: "provider1",
                    provider_details: JSON.stringify({ name: "Provider 1" }),
                    stake: JSON.stringify({ amount: "1000" }),
                    created_at: Date.now()
                },
                {
                    provider_id: "provider2",
                    provider_details: JSON.stringify({ name: "Provider 2" }),
                    stake: JSON.stringify({ amount: "2000" }),
                    created_at: Date.now()
                }
            ];

            // Override dryrun mock for this test
            jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValueOnce({
                Output: undefined,
                Messages: [{ Data: JSON.stringify(mockProviderDTOs), Tags: [] }],
                Spawns: []
            });

            const result = await client.getAllProvidersInfo();

            // Verify proper parsing of provider details and stake
            expect(result).toHaveLength(2);
            expect(result[0].provider_details).toEqual({ name: "Provider 1" });
            expect(result[0].stake).toEqual({ amount: "1000" });
            expect(result[1].provider_details).toEqual({ name: "Provider 2" });
            expect(result[1].stake).toEqual({ amount: "2000" });
        });
    });

    describe("getProviderInfo()", () => {
        it("should use provided providerId when available", async () => {
            const providerId = "specific-provider-id";
            const dryrunSpy = jest.spyOn(BaseClient.prototype, 'dryrun');
            
            await client.getProviderInfo(providerId);

            // Verify the correct providerId was used in the message data
            expect(dryrunSpy).toHaveBeenCalledWith(
                JSON.stringify({ providerId }),
                expect.any(Array)
            );
        });

        it("should fall back to calling wallet address when providerId not provided", async () => {
            const dryrunSpy = jest.spyOn(BaseClient.prototype, 'dryrun');
            const getWalletSpy = jest.spyOn(BaseClient.prototype, 'getCallingWalletAddress');
            
            await client.getProviderInfo();

            expect(getWalletSpy).toHaveBeenCalled();
            expect(dryrunSpy).toHaveBeenCalledWith(
                JSON.stringify({ providerId: "test-wallet" }),
                expect.any(Array)
            );
        });
    });

    describe("_parseProviderInfoDTO()", () => {
        it("should handle undefined provider_details", async () => {
            const dto: ProviderInfoDTO = {
                provider_id: "test-provider",
                provider_details: undefined,
                stake: JSON.stringify({ amount: "1000" }),
                created_at: Date.now()
            };

            const result = (client as any)._parseProviderInfoDTO(dto);

            expect(result.provider_details).toBeUndefined();
            expect(result.stake).toEqual({ amount: "1000" });
        });

        it("should properly parse JSON strings in DTO", async () => {
            const dto: ProviderInfoDTO = {
                provider_id: "test-provider",
                provider_details: JSON.stringify({ name: "Test", description: "Test Description" }),
                stake: JSON.stringify({ amount: "1000", locked: true }),
                created_at: Date.now()
            };

            const result = (client as any)._parseProviderInfoDTO(dto);

            expect(result.provider_details).toEqual({ name: "Test", description: "Test Description" });
            expect(result.stake).toEqual({ amount: "1000", locked: true });
        });
    });
});
