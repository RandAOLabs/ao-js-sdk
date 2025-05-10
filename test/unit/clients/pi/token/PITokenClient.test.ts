// Create mock functions that will be shared between direct imports and connect() return value
const message = jest.fn();
const results = jest.fn();
const result = jest.fn();
const dryrun = jest.fn();
const mockCreateDataItemSigner = jest.fn();

jest.mock('@permaweb/aoconnect', () => ({
    // Direct exports
    createDataItemSigner: mockCreateDataItemSigner,
    // connect function that returns the same mock functions
    connect: jest.fn().mockReturnValue({
        message: message,
        results: results,
        result: result,
        dryrun: dryrun,
        createDataItemSigner: mockCreateDataItemSigner
    })
}));

import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { PITokenClient } from "src/clients/pi/PIToken/PITokenClient";
import { PITokenClientError } from "src/clients/pi/PIToken/PITokenClientError";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { ClientBuilder } from "src/clients/common";

// Mock the logger
jest.mock('src/utils/logger/logger', () => {
    const actualLogger = jest.requireActual('src/utils/logger/logger');
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

describe("PITokenClient", () => {
    let client: PITokenClient;
    const testProcessId = "test-pi-token-process-id";

    beforeEach(() => {
        // Create a new client using the builder
        client = PITokenClient.builder()
            .withProcessId(testProcessId)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO)
            .build();
        
        jest.clearAllMocks();
    });

    describe("getInfo()", () => {
        it("should call dryrun with correct parameters", async () => {
            // Arrange
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({
                            type: "pi-token",
                            tokenTicker: "TEST",
                            totalDistributionTicks: "12"
                        }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getInfo();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Info" }
            ]);
            expect(result).toBe(mockResponse);
        });

        it("should throw PITokenClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getInfo()).rejects.toThrow(PITokenClientError);
        });
    });

    describe("getTickHistory()", () => {
        it("should handle successful tick history response", async () => {
            // Arrange
            const mockTickHistory = [
                { Timestamp: 1000, TriggerMintReportIds: ["1"] },
                { Timestamp: 2000, TriggerMintReportIds: ["2"] }
            ];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockTickHistory),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getTickHistory();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Yield-Tick-History" }
            ]);
            expect(result).toBe(JSON.stringify(mockTickHistory));
        });

        it("should handle empty messages response gracefully", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act
            const result = await client.getTickHistory();

            // Assert
            expect(dryrun).toHaveBeenCalled();
            expect(result).toBe('[]');
        });

        it("should handle error gracefully", async () => {
            // Arrange
            dryrun.mockRejectedValueOnce(new Error("Failed request"));

            // Act
            const result = await client.getTickHistory();

            // Assert
            expect(dryrun).toHaveBeenCalled();
            expect(result).toBe('[]'); // Should return empty array on error
        });
    });

    describe("parseTickHistory()", () => {
        it("should parse valid tick history data", () => {
            // Arrange
            const mockTickHistory = [
                { Timestamp: 1000, TriggerMintReportIds: ["1"] },
                { Timestamp: 2000, TriggerMintReportIds: ["2"] }
            ];
            const tickHistoryData = JSON.stringify(mockTickHistory);
            
            // Act
            const result = client.parseTickHistory(tickHistoryData);

            // Assert
            expect(result).toEqual(mockTickHistory);
        });

        it("should throw error on invalid tick history data", () => {
            // Arrange
            const invalidData = "{invalid-json";
            
            // Act & Assert
            expect(() => client.parseTickHistory(invalidData)).toThrow();
        });
    });

    describe("getBalance()", () => {
        it("should fetch balance with correct parameters", async () => {
            // Arrange
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: "1000",
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getBalance();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Balance" }
            ]);
            expect(result).toBe("1000");
        });

        it("should include target wallet when provided", async () => {
            // Arrange
            const targetWallet = "test-wallet-address";
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: "500",
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getBalance(targetWallet);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Balance" },
                { name: "Target", value: targetWallet }
            ]);
            expect(result).toBe("500");
        });

        it("should handle error gracefully", async () => {
            // Arrange
            dryrun.mockRejectedValueOnce(new Error("Failed request"));

            // Act
            const result = await client.getBalance();

            // Assert
            expect(result).toBe('0'); // Should return zero on error
        });
    });

    describe("getClaimableBalance()", () => {
        it("should fetch claimable balance with correct parameters", async () => {
            // Arrange
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: "500",
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getClaimableBalance();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Claimable-Balance" }
            ]);
            expect(result).toBe("500");
        });

        it("should handle error gracefully", async () => {
            // Arrange
            dryrun.mockRejectedValueOnce(new Error("Failed request"));

            // Act
            const result = await client.getClaimableBalance();

            // Assert
            expect(result).toBe('0'); // Should return zero on error
        });
    });

    describe("builder pattern", () => {
        it("should create a client with builder", () => {
            // Act
            const newClient = PITokenClient.builder()
                .withProcessId("custom-process-id")
                .withAOConfig(AO_CONFIGURATIONS.RANDAO)
                .build();
            
            // Assert
            expect(newClient).toBeInstanceOf(PITokenClient);
            expect(newClient.getProcessId()).toBe("custom-process-id");
        });

        it("should create a client with static build method", () => {
            // Act
            const newClient = PITokenClient.build("custom-process-id");
            
            // Assert
            expect(newClient).toBeInstanceOf(PITokenClient);
            expect(newClient.getProcessId()).toBe("custom-process-id");
        });

        it("should use default builder correctly", async () => {
            // Act
            const builder = await PITokenClient.defaultBuilder();
            const newClient = builder.build();
            
            // Assert
            expect(builder).toBeInstanceOf(ClientBuilder);
            expect(newClient).toBeInstanceOf(PITokenClient);
        });
    });
});
