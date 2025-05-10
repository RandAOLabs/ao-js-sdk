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
import { PIDelegateClient } from "src/clients/pi/delegate/PIDelegateClient";
import { PIDelegateClientError } from "src/clients/pi/delegate/PIDelegateClientError";
import { DelegationPreferences } from "src/clients/pi/delegate/abstract/IPIDelegateClient";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";

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

describe("PIDelegateClient", () => {
    let client: PIDelegateClient;
    const testProcessId = "test-pi-delegate-process-id";
    const testWalletAddress = "test-wallet-address";

    beforeEach(() => {
        // Create a new client using the builder
        client = PIDelegateClient.builder()
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
                            type: "pi-delegate",
                            version: "1.0"
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

        it("should throw PIDelegateClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getInfo()).rejects.toThrow(PIDelegateClientError);
        });
    });

    describe("getDelegation()", () => {
        it("should call dryrun with correct parameters when wallet address is provided", async () => {
            // Arrange
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({
                            address: testWalletAddress,
                            delegatedTokens: ["TK1", "TK2"]
                        }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getDelegation(testWalletAddress);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Delegation" },
                { name: "Address", value: testWalletAddress }
            ]);
            expect(result).toEqual({
                address: testWalletAddress,
                delegatedTokens: ["TK1", "TK2"]
            });
        });

        it("should default to undefined wallet address", async () => {
            // Arrange
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({
                            address: "default-wallet",
                            delegatedTokens: ["TK1"]
                        }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getDelegation();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Delegation" }
            ]);
            expect(result).toEqual({
                address: "default-wallet",
                delegatedTokens: ["TK1"]
            });
        });

        it("should handle empty response correctly", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act
            const result = await client.getDelegation(testWalletAddress);

            // Assert
            expect(result).toBeNull();
        });

        it("should throw PIDelegateClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getDelegation(testWalletAddress)).rejects.toThrow(PIDelegateClientError);
        });
    });

    describe("setDelegation()", () => {
        it("should call dryrun with correct parameters", async () => {
            // Arrange
            const delegationPreferences: DelegationPreferences = {
                address: testWalletAddress,
                delegatedTokens: ["TK1", "TK2"]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({ success: true }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.setDelegation(delegationPreferences);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Set-Delegation" },
                { name: "Address", value: testWalletAddress },
                { name: "DelegatedTokens", value: JSON.stringify(["TK1", "TK2"]) }
            ]);
            expect(result).toBeTruthy();
        });

        it("should handle empty array of delegated tokens", async () => {
            // Arrange
            const delegationPreferences: DelegationPreferences = {
                address: testWalletAddress,
                delegatedTokens: []
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({ success: true }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.setDelegation(delegationPreferences);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Set-Delegation" },
                { name: "Address", value: testWalletAddress },
                { name: "DelegatedTokens", value: "[]" }
            ]);
            expect(result).toBeTruthy();
        });

        it("should handle failure response", async () => {
            // Arrange
            const delegationPreferences: DelegationPreferences = {
                address: testWalletAddress,
                delegatedTokens: ["TK1"]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify({ success: false }),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.setDelegation(delegationPreferences);

            // Assert
            expect(result).toBeFalsy();
        });

        it("should throw PIDelegateClientError on failure", async () => {
            // Arrange
            const delegationPreferences: DelegationPreferences = {
                address: testWalletAddress,
                delegatedTokens: ["TK1"]
            };
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.setDelegation(delegationPreferences)).rejects.toThrow(PIDelegateClientError);
        });
    });

    describe("getDelegatedTokens()", () => {
        it("should return array of delegated tokens", async () => {
            // Arrange
            const mockDelegation = {
                address: testWalletAddress,
                delegatedTokens: ["TK1", "TK2"]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockDelegation),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getDelegatedTokens(testWalletAddress);

            // Assert
            expect(dryrun).toHaveBeenCalled();
            expect(result).toEqual(["TK1", "TK2"]);
        });

        it("should return empty array if no delegation exists", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act
            const result = await client.getDelegatedTokens(testWalletAddress);

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw PIDelegateClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getDelegatedTokens(testWalletAddress)).rejects.toThrow(PIDelegateClientError);
        });
    });

    describe("isDelegatedToken()", () => {
        it("should return true for delegated token", async () => {
            // Arrange
            const tokenTicker = "TK1";
            const mockDelegation = {
                address: testWalletAddress,
                delegatedTokens: ["TK1", "TK2"]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockDelegation),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.isDelegatedToken(tokenTicker, testWalletAddress);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false for non-delegated token", async () => {
            // Arrange
            const tokenTicker = "TK3";
            const mockDelegation = {
                address: testWalletAddress,
                delegatedTokens: ["TK1", "TK2"]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockDelegation),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.isDelegatedToken(tokenTicker, testWalletAddress);

            // Assert
            expect(result).toBe(false);
        });

        it("should return false if no delegation exists", async () => {
            // Arrange
            const tokenTicker = "TK1";
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act
            const result = await client.isDelegatedToken(tokenTicker, testWalletAddress);

            // Assert
            expect(result).toBe(false);
        });

        it("should throw PIDelegateClientError on failure", async () => {
            // Arrange
            const tokenTicker = "TK1";
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.isDelegatedToken(tokenTicker, testWalletAddress)).rejects.toThrow(PIDelegateClientError);
        });
    });

    describe("builder pattern", () => {
        it("should create a client with builder", () => {
            // Act
            const newClient = PIDelegateClient.builder()
                .withProcessId("custom-process-id")
                .withAOConfig(AO_CONFIGURATIONS.RANDAO)
                .build();
            
            // Assert
            expect(newClient).toBeInstanceOf(PIDelegateClient);
            expect(newClient.getProcessId()).toBe("custom-process-id");
        });

        it("should create a client with static build method", () => {
            // Act
            const newClient = PIDelegateClient.build();
            
            // Assert
            expect(newClient).toBeInstanceOf(PIDelegateClient);
        });
    });
});
