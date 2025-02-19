import { ProfilesService } from "src/services/profiles";
import { ProfileClient } from "src/clients/profile/ProfileClient";
import { ProfileRegistryClient } from "src/clients/profile-registry/ProfileRegistryClient";
import { ProfileInfo } from "src/clients/profile/abstract/types";
import { ProfileRegistryEntry } from "src/clients/profile-registry/abstract";
import { Logger, LogLevel } from "src/utils";

// Mock the clients
jest.mock("src/clients/profile/ProfileClient");
jest.mock("src/clients/profile-registry/ProfileRegistryClient");

// Get constructor types for mocking
const MockedProfileClient = ProfileClient as jest.MockedClass<typeof ProfileClient>;
const MockedProfileRegistryClient = ProfileRegistryClient as jest.Mocked<typeof ProfileRegistryClient>;

describe("ProfilesService", () => {
    let service: ProfilesService;
    let mockProfileRegistryClient: jest.Mocked<ProfileRegistryClient>;
    let mockProfileClient: jest.Mocked<ProfileClient>;

    const mockRegistryEntry: ProfileRegistryEntry = {
        ProfileId: "test-profile-id",
        CallerAddress: "test-caller",
        Role: "test-role"
    };

    const mockProfileInfo: ProfileInfo = {
        Profile: {},
        Assets: [],
        Collections: [],
        Owner: "test-owner"
    };

    beforeAll(() => {
        Logger.setLogLevel(LogLevel.DEBUG)
    });

    beforeEach(() => {
        // Clear all mocks and reset modules
        jest.clearAllMocks();
        jest.resetModules();

        // Mock ProfileRegistryClient.autoConfiguration
        mockProfileRegistryClient = {
            getProfileByWalletAddress: jest.fn(),
        } as unknown as jest.Mocked<ProfileRegistryClient>;
        MockedProfileRegistryClient.autoConfiguration = jest.fn().mockReturnValue(mockProfileRegistryClient);

        // Mock ProfileClient constructor and methods
        mockProfileClient = {
            getProfileInfo: jest.fn(),
        } as unknown as jest.Mocked<ProfileClient>;
        MockedProfileClient.mockImplementation(() => mockProfileClient);

        // Reset singleton instance
        // @ts-ignore - accessing private property for testing
        ProfilesService.instance = undefined;
        service = ProfilesService.getInstance();
    });

    describe("getProfileInfosByWalletAddress", () => {
        it("should fetch profile infos for wallet addresses", async () => {
            Logger.info(1)
            // Setup mocks
            mockProfileRegistryClient.getProfileByWalletAddress.mockResolvedValue([mockRegistryEntry]);
            mockProfileClient.getProfileInfo.mockResolvedValue(mockProfileInfo);

            // Test
            const result = await service.getProfileInfosByWalletAddress(["test-wallet"]);

            // Verify
            expect(mockProfileRegistryClient.getProfileByWalletAddress).toHaveBeenCalledWith("test-wallet");
            expect(mockProfileClient.getProfileInfo).toHaveBeenCalled();
            expect(result).toEqual([mockProfileInfo]);
        });

        it("should handle empty registry results", async () => {
            Logger.info(2)

            // Setup mocks
            mockProfileRegistryClient.getProfileByWalletAddress.mockResolvedValue([]);

            // Test
            const result = await service.getProfileInfosByWalletAddress(["test-wallet"]);

            // Verify
            expect(result).toEqual([]);
            expect(mockProfileClient.getProfileInfo).not.toHaveBeenCalled();
        });

        it("should handle registry errors", async () => {
            Logger.info(3)

            // Setup mocks
            mockProfileRegistryClient.getProfileByWalletAddress.mockRejectedValue(new Error("Registry error"));

            // Test
            const result = await service.getProfileInfosByWalletAddress(["test-wallet"]);

            // Verify
            expect(result).toEqual([]);
        });
    });

    describe("getProfileInfosByProfileProcessIds", () => {
        it("should fetch profile infos for process IDs", async () => {
            Logger.info(4)

            // Setup mocks
            mockProfileClient.getProfileInfo.mockResolvedValue(mockProfileInfo);

            // Test
            const result = await service.getProfileInfosByProfileProcessIds(["test-process-id"]);

            // Verify
            expect(mockProfileClient.getProfileInfo).toHaveBeenCalled();
            expect(result).toEqual([mockProfileInfo]);
        });

        it("should handle profile client errors", async () => {
            Logger.info(5)

            // Setup mocks
            mockProfileClient.getProfileInfo.mockRejectedValue(new Error("Profile error"));

            // Test
            const result = await service.getProfileInfosByProfileProcessIds(["test-process-id"]);

            // Verify
            expect(result).toEqual([]);
        });

        it("should use cache for subsequent requests", async () => {
            Logger.info(6)

            // Setup mocks
            mockProfileClient.getProfileInfo.mockResolvedValue(mockProfileInfo);

            // First request
            await service.getProfileInfosByProfileProcessIds(["test-process-id"]);

            // Second request - should use cache
            await service.getProfileInfosByProfileProcessIds(["test-process-id"]);

            // Verify
            expect(mockProfileClient.getProfileInfo).toHaveBeenCalledTimes(1);
        });
    });
});
