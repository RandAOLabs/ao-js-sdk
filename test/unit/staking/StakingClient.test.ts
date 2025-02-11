import { StakingClient } from "../../../src/index";
import { BaseClient } from "../../../src/core/ao/BaseClient";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { TokenClient } from "../../../src/index";
import { ProviderDetails } from "../../../src/clients/process/staking/abstract/types";
import { UnstakeError } from "../../../src/index";

// Mock individual methods of BaseClient using jest.spyOn
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
    Output: undefined,
    Messages: [{ ID: "test-message-id", Data: "200: Success", Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);
const dryRunResult: DryRunResult = {
    Output: undefined,
    Messages: [{ Data: JSON.stringify({ providerId: "test-provider", stake: "1000" }), Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);
jest.mock("../../../src/clients/process/token/index");
/*
* Mocks the logger for tests to suppress log outputs.
* Logs a warning that logging has been disabled for the current test suite.
*/
jest.mock('../../../src/utils/logger/logger', () => {
    const actualLogger = jest.requireActual('../../../src/utils/logger/logger');
    return {
        ...actualLogger,
        Logger: {
            ...actualLogger.Logger,
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            log: jest.fn(),
        },
    };
});

describe("StakingClient Unit Test", () => {
    let client: StakingClient;
    let mockTokenClient: jest.Mocked<TokenClient>;

    beforeAll(() => {
        client = StakingClient.autoConfiguration();

        mockTokenClient = {
            transfer: jest.fn().mockResolvedValue(true),
        } as unknown as jest.Mocked<TokenClient>;

        // Inject the mocked tokenClient into the StakingClient instance
        (client as any).tokenClient = mockTokenClient;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("stake()", () => {
        const quantity = "100000000000000000000";

        it("should stake tokens without provider details", async () => {
            const response = await client.stake(quantity);
            expect(response).toBe(true);

            expect(mockTokenClient.transfer).toHaveBeenCalled();
        });

        it("should stake tokens with provider details", async () => {
            const providerDetails: ProviderDetails = {
                name: "Test Provider",
                commission: 10,
                description: "Test Description"
            };

            const response = await client.stake(quantity, providerDetails);
            expect(response).toBe(true);

            expect(mockTokenClient.transfer).toHaveBeenCalled();
        });

        it("should throw error if token transfer fails", async () => {
            mockTokenClient.transfer.mockResolvedValueOnce(false);
            await expect(client.stake(quantity)).rejects.toThrow();
        });
    });

    describe("updateDetails()", () => {
        it("should update provider details", async () => {
            const providerDetails: ProviderDetails = {
                name: "Test Provider",
                commission: 10,
                description: "Test Description",
                twitter: "@test"
            };

            const response = await client.updateDetails(providerDetails);
            expect(response).toBe("200: Success");

            expect(BaseClient.prototype.messageResult).toHaveBeenCalled();
        });
    });

    describe("getStake()", () => {
        it("should fetch stake information", async () => {
            const providerId = "test-provider";
            const response = await client.getStake(providerId);

            expect(response).toBeDefined();
            expect(BaseClient.prototype.dryrun).toHaveBeenCalled();
        });
    });

    describe("unstake()", () => {
        const providerId = "test-provider";

        it("should return true when unstaking succeeds", async () => {
            const successResult: MessageResult = {
                Output: undefined,
                Messages: [{ ID: "test-message-id", Data: "Stake successfully removed", Tags: [] }],
                Spawns: []
            };
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValueOnce(successResult);

            const response = await client.unstake(providerId);
            expect(response).toBe(true);
            expect(BaseClient.prototype.messageResult).toHaveBeenCalled();
        });

        it("should return false when unstaking fails", async () => {
            const failureResult: MessageResult = {
                Output: undefined,
                Messages: [{ ID: "test-message-id", Data: "Failed to unstake: insufficient balance", Tags: [] }],
                Spawns: []
            };
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValueOnce(failureResult);

            const response = await client.unstake(providerId);
            expect(response).toBe(false);
            expect(BaseClient.prototype.messageResult).toHaveBeenCalled();
        });

        it("should throw UnstakeError when messageResult fails", async () => {
            jest.spyOn(BaseClient.prototype, 'messageResult').mockRejectedValueOnce(new Error("Network error"));

            await expect(client.unstake(providerId)).rejects.toThrow(UnstakeError);
            expect(BaseClient.prototype.messageResult).toHaveBeenCalled();
        });

        it("should return false when response is empty", async () => {
            const emptyResult: MessageResult = {
                Output: undefined,
                Messages: [{ ID: "test-message-id", Data: "", Tags: [] }],
                Spawns: []
            };
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValueOnce(emptyResult);

            const response = await client.unstake(providerId);
            expect(response).toBe(false);
            expect(BaseClient.prototype.messageResult).toHaveBeenCalled();
        });
    });
});
