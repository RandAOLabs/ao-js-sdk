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
import { DelegationHistorianClient } from "src/clients/pi/historian/DelegationHistorianClient";
import { DelegationHistorianClientError } from "src/clients/pi/historian/DelegationHistorianClientError";
import { DelegationRecord, ProjectDelegationTotal } from "src/clients/pi/historian/abstract/IDelegationHistorianClient";
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

describe("DelegationHistorianClient", () => {
    let client: DelegationHistorianClient;
    const testProcessId = "test-delegation-historian-process-id";

    beforeEach(() => {
        // Create a new client using the builder
        client = DelegationHistorianClient.builder()
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
                            type: "delegation-historian",
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

        it("should throw DelegationHistorianClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getInfo()).rejects.toThrow(DelegationHistorianClientError);
        });
    });

    describe("getTotalDelegatedAOByProject()", () => {
        it("should return project delegation totals", async () => {
            // Arrange
            const mockData = {
                "project1": "100",
                "project2": "200"
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockData),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getTotalDelegatedAOByProject();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Total-Delegated-AO-By-Project" }
            ]);
            expect(result).toEqual([
                { projectId: "project1", amount: "100" },
                { projectId: "project2", amount: "200" }
            ]);
        });

        it("should throw error if no data returned", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act & Assert
            await expect(client.getTotalDelegatedAOByProject()).rejects.toThrow(
                'No data returned from Get-Total-Delegated-AO-By-Project'
            );
        });

        it("should throw DelegationHistorianClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getTotalDelegatedAOByProject()).rejects.toThrow(DelegationHistorianClientError);
        });
    });

    describe("getLastRecord()", () => {
        it("should return the last delegation record", async () => {
            // Arrange
            const mockRecord: DelegationRecord = {
                delegationsTimestamp: 123456789,
                delegations: [{ address: "wallet1", delegations: [{ tokenId: "token1", amount: "100" }] }]
            };
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockRecord),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getLastRecord();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Last-Record" }
            ]);
            expect(result).toEqual(mockRecord);
        });

        it("should throw error if no data returned", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act & Assert
            await expect(client.getLastRecord()).rejects.toThrow('No data returned from Get-Last-Record');
        });

        it("should throw DelegationHistorianClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getLastRecord()).rejects.toThrow(DelegationHistorianClientError);
        });
    });

    describe("getRecords()", () => {
        it("should return delegation records", async () => {
            // Arrange
            const mockRecords: DelegationRecord[] = [
                {
                    delegationsTimestamp: 123456789,
                    delegations: [{ address: "wallet1", delegations: [{ tokenId: "token1", amount: "100" }] }]
                },
                {
                    delegationsTimestamp: 123456790,
                    delegations: [{ address: "wallet2", delegations: [{ tokenId: "token2", amount: "200" }] }]
                }
            ];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockRecords),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getRecords();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Records" }
            ]);
            expect(result).toEqual(mockRecords);
        });

        it("should include limit parameter when provided", async () => {
            // Arrange
            const limit = 5;
            const mockRecords: DelegationRecord[] = [];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockRecords),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            await client.getRecords(limit);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Records" },
                { name: "Limit", value: limit.toString() }
            ]);
        });

        it("should throw error if no data returned", async () => {
            // Arrange
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act & Assert
            await expect(client.getRecords()).rejects.toThrow('No data returned from Get-Records');
        });

        it("should throw DelegationHistorianClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getRecords()).rejects.toThrow(DelegationHistorianClientError);
        });
    });

    describe("getRecordsByAddress()", () => {
        it("should return delegation records for a specific address", async () => {
            // Arrange
            const testAddress = "test-wallet-address";
            const mockRecords = [
                {
                    delegationsTimestamp: 123456789,
                    delegations: [{ tokenId: "token1", amount: "100" }]
                }
            ];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockRecords),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getRecordsByAddress(testAddress);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Records-By-Address" },
                { name: "Address", value: testAddress }
            ]);
            expect(result).toEqual(mockRecords);
        });

        it("should include limit parameter when provided", async () => {
            // Arrange
            const testAddress = "test-wallet-address";
            const limit = 5;
            const mockRecords = [];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockRecords),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            await client.getRecordsByAddress(testAddress, limit);

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-Records-By-Address" },
                { name: "Address", value: testAddress },
                { name: "Limit", value: limit.toString() }
            ]);
        });

        it("should throw error if no data returned", async () => {
            // Arrange
            const testAddress = "test-wallet-address";
            dryrun.mockResolvedValueOnce({ Messages: [] });

            // Act & Assert
            await expect(client.getRecordsByAddress(testAddress)).rejects.toThrow(
                'No data returned from Get-Records-By-Address'
            );
        });

        it("should throw DelegationHistorianClientError on failure", async () => {
            // Arrange
            const testAddress = "test-wallet-address";
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getRecordsByAddress(testAddress)).rejects.toThrow(DelegationHistorianClientError);
        });
    });

    describe("builder pattern", () => {
        it("should create a client with builder", () => {
            // Act
            const newClient = DelegationHistorianClient.builder()
                .withProcessId("custom-process-id")
                .withAOConfig(AO_CONFIGURATIONS.RANDAO)
                .build();
            
            // Assert
            expect(newClient).toBeInstanceOf(DelegationHistorianClient);
            expect(newClient.getProcessId()).toBe("custom-process-id");
        });

        it("should create a client with static build method", () => {
            // Act
            const newClient = DelegationHistorianClient.build();
            
            // Assert
            expect(newClient).toBeInstanceOf(DelegationHistorianClient);
        });
    });
});
