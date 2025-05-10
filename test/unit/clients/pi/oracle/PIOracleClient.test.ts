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
import { PIOracleClient } from "src/clients/pi/oracle/PIOracleClient";
import { PIOracleClientError } from "src/clients/pi/oracle/PIOracleClientError";
import { PIToken } from "src/clients/pi/oracle/abstract/IPIOracleClient";
import { PITokenClient } from "src/clients/pi/PIToken/PITokenClient";
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

describe("PIOracleClient", () => {
    let client: PIOracleClient;
    const testProcessId = "test-pi-oracle-process-id";

    beforeEach(() => {
        // Create a new client using the builder
        client = PIOracleClient.builder()
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
                            type: "pi-oracle",
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

        it("should handle timeout properly", async () => {
            // Arrange - setup a timer that will reject after 20ms
            jest.useFakeTimers();
            dryrun.mockImplementation(() => new Promise((resolve) => {
                setTimeout(() => resolve({ Messages: [] }), 20000);
            }));
            
            // Act & Assert
            const resultPromise = client.getInfo();
            jest.advanceTimersByTime(16000); // Advance past the timeout (15s)
            
            // Should reject with error
            await expect(resultPromise).rejects.toThrow("Oracle info request timed out");
            
            jest.useRealTimers();
        });

        it("should throw PIOracleClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getInfo()).rejects.toThrow(PIOracleClientError);
        });
    });

    describe("getPITokens()", () => {
        it("should call dryrun with correct parameters and return data", async () => {
            // Arrange
            const mockTokens = [
                { id: "token1", ticker: "TK1", process: "proc1", status: "active" },
                { id: "token2", ticker: "TK2", process: "proc2", status: "active" }
            ];
            const mockResponse: DryRunResult = {
                Messages: [
                    {
                        Data: JSON.stringify(mockTokens),
                        Tags: []
                    }
                ]
            };
            dryrun.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await client.getPITokens();

            // Assert
            expect(dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Get-FLPs" }
            ]);
            expect(result).toBe(JSON.stringify(mockTokens));
        });

        it("should throw PIOracleClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getPITokens()).rejects.toThrow(PIOracleClientError);
        });
    });

    describe("parsePITokens()", () => {
        it("should parse array of objects format correctly", () => {
            // Arrange
            const mockTokens = [
                { id: "token1", ticker: "TK1", process: "proc1", status: "active" },
                { id: "token2", ticker: "TK2", process: "proc2", status: "active" }
            ];
            const tokensData = JSON.stringify(mockTokens);
            
            // Act
            const result = client.parsePITokens(tokensData);

            // Assert
            expect(result).toHaveLength(3); // 2 tokens + custom token
            expect(result[0]).toEqual(mockTokens[0]);
            expect(result[1]).toEqual(mockTokens[1]);
        });

        it("should parse array of arrays format correctly", () => {
            // Arrange
            const mockTokens = [
                ["TK1", { id: "token1", ticker: "TK1", process: "proc1", status: "active" }],
                ["TK2", { id: "token2", ticker: "TK2", process: "proc2", status: "active" }]
            ];
            const tokensData = JSON.stringify(mockTokens);
            
            // Act
            const result = client.parsePITokens(tokensData);

            // Assert
            expect(result).toHaveLength(3); // 2 tokens + custom token
            expect(result[0].ticker).toBe("TK1");
            expect(result[1].ticker).toBe("TK2");
        });

        it("should add custom token to result", () => {
            // Arrange
            const mockTokens: PIToken[] = [];
            const tokensData = JSON.stringify(mockTokens);
            
            // Act
            const result = client.parsePITokens(tokensData);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].ticker).toBe("CUSTOM");
            expect(result[0].id).toBe("rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE");
        });

        it("should throw error on invalid tokens data", () => {
            // Arrange
            const invalidData = "{invalid-json";
            
            // Act & Assert
            expect(() => client.parsePITokens(invalidData)).toThrow();
        });
    });

    describe("getTokensMap()", () => {
        it("should return map of PI tokens", async () => {
            // Arrange
            const mockTokens = [
                { id: "token1", ticker: "TK1", process: "proc1", status: "active", flp_token_ticker: "TK1" },
                { id: "token2", ticker: "TK2", process: "proc2", status: "active", flp_token_ticker: "TK2" }
            ];
            dryrun.mockResolvedValueOnce({
                Messages: [{ Data: JSON.stringify(mockTokens) }]
            });

            // Act
            const result = await client.getTokensMap();

            // Assert
            expect(dryrun).toHaveBeenCalled();
            expect(result).toBeInstanceOf(Map);
            expect(result.size).toBe(2);
            expect(result.has("TK1")).toBe(true);
            expect(result.has("TK2")).toBe(true);
        });

        it("should throw PIOracleClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.getTokensMap()).rejects.toThrow(PIOracleClientError);
        });
    });

    describe("createTokenClient()", () => {
        it("should create PITokenClient with correct process ID", () => {
            // Arrange
            const tokenProcessId = "token-process-id";

            // Act
            const tokenClient = client.createTokenClient(tokenProcessId);

            // Assert
            expect(tokenClient).toBeInstanceOf(PITokenClient);
            expect(tokenClient.getProcessId()).toBe(tokenProcessId);
        });
    });

    describe("createTokenClients()", () => {
        it("should create a map of token clients", async () => {
            // Arrange
            const mockTokens = [
                { id: "token1", ticker: "TK1", process: "proc1", status: "active", flp_token_ticker: "TK1", flp_token_process: "proc1" },
                { id: "token2", ticker: "TK2", process: "proc2", status: "active", flp_token_ticker: "TK2", flp_token_process: "proc2" }
            ];
            dryrun.mockResolvedValueOnce({
                Messages: [{ Data: JSON.stringify(mockTokens) }]
            });

            // Act
            const result = await client.createTokenClients();

            // Assert
            expect(result).toBeInstanceOf(Map);
            expect(result.size).toBe(2);
            expect(result.has("TK1")).toBe(true);
            expect(result.has("TK2")).toBe(true);
            expect(result.get("TK1")).toBeInstanceOf(PITokenClient);
            expect(result.get("TK2")).toBeInstanceOf(PITokenClient);
        });

        it("should throw PIOracleClientError on failure", async () => {
            // Arrange
            const mockError = new Error("API Error");
            dryrun.mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(client.createTokenClients()).rejects.toThrow(PIOracleClientError);
        });
    });

    describe("createTokenClientPairs()", () => {
        it("should create a map of token client pairs", async () => {
            // Arrange
            const mockTokens = [
                { id: "token1", ticker: "TK1", process: "proc1", status: "active", flp_token_ticker: "TK1" },
                { id: "token2", ticker: "TK2", process: "proc2", status: "active", flp_token_ticker: "TK2" }
            ];
            dryrun.mockResolvedValueOnce({
                Messages: [{ Data: JSON.stringify(mockTokens) }]
            });

            // Act
            const result = await client.createTokenClientPairs();

            // Assert
            expect(result).toBeInstanceOf(Map);
        });
    });

    describe("builder pattern", () => {
        it("should create a client with builder", () => {
            // Act
            const newClient = PIOracleClient.builder()
                .withProcessId("custom-process-id")
                .withAOConfig(AO_CONFIGURATIONS.RANDAO)
                .build();
            
            // Assert
            expect(newClient).toBeInstanceOf(PIOracleClient);
            expect(newClient.getProcessId()).toBe("custom-process-id");
        });

        it("should create a client with static build method", () => {
            // Act
            const newClient = PIOracleClient.build("http://custom-cu-url.com");
            
            // Assert
            expect(newClient).toBeInstanceOf(PIOracleClient);
        });

        it("should use default builder correctly", async () => {
            // Act
            const builder = await PIOracleClient.defaultBuilder();
            
            // Assert
            expect(builder).not.toBeNull();
        });
    });
});
