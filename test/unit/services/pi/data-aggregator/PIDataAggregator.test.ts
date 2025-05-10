// Create mock functions for aoconnect
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

import { PIDataAggregator } from "src/services/pi/PIDataAggregator";
import { PIOracleClient } from "src/clients/pi/oracle/PIOracleClient";
import { PIDelegateClient } from "src/clients/pi/delegate/PIDelegateClient";
import { DelegationHistorianClient } from "src/clients/pi/historian/DelegationHistorianClient";
import { PIToken } from "src/clients/pi/oracle/abstract/IPIOracleClient";
import { ProjectDelegationTotal } from "src/clients/pi/historian/abstract/IDelegationHistorianClient";
import { PITokenExtended } from "src/services/pi/abstract/types";

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

// Mock the client classes
jest.mock("src/clients/pi/oracle/PIOracleClient");
jest.mock("src/clients/pi/delegate/PIDelegateClient");
jest.mock("src/clients/pi/historian/DelegationHistorianClient");

describe("PIDataAggregator", () => {
    let aggregator: PIDataAggregator;
    let mockOracleClient: jest.Mocked<PIOracleClient>;
    let mockDelegateClient: jest.Mocked<PIDelegateClient>;
    let mockHistorianClient: jest.Mocked<DelegationHistorianClient>;

    const mockTokens: PIToken[] = [
        { id: "token1", ticker: "TK1", process: "proc1", status: "active" },
        { id: "token2", ticker: "TK2", process: "proc2", status: "active" }
    ];

    const mockTotals: ProjectDelegationTotal[] = [
        { projectId: "proc1", amount: "100" },
        { projectId: "proc2", amount: "200" }
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create mock instances
        mockOracleClient = new PIOracleClient({} as any) as jest.Mocked<PIOracleClient>;
        mockDelegateClient = new PIDelegateClient({} as any) as jest.Mocked<PIDelegateClient>;
        mockHistorianClient = new DelegationHistorianClient({} as any) as jest.Mocked<DelegationHistorianClient>;
        
        // Mock client methods
        mockOracleClient.parsePITokens = jest.fn().mockReturnValue(mockTokens);
        mockOracleClient.getPITokens = jest.fn().mockResolvedValue(JSON.stringify(mockTokens));
        
        mockDelegateClient.getDelegatedTokens = jest.fn().mockResolvedValue(["TK1"]);
        mockDelegateClient.isDelegatedToken = jest.fn().mockImplementation((ticker) => Promise.resolve(ticker === "TK1"));
        
        mockHistorianClient.getTotalDelegatedAOByProject = jest.fn().mockResolvedValue(mockTotals);
        
        // Create the aggregator
        aggregator = new PIDataAggregator(
            mockOracleClient,
            mockDelegateClient,
            mockHistorianClient
        );
    });

    describe("getExtendedTokens", () => {
        it("should return extended tokens with delegation status and totals", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            
            // Act
            const result = await aggregator.getExtendedTokens(mockWalletAddress);
            
            // Assert
            expect(mockOracleClient.getPITokens).toHaveBeenCalled();
            expect(mockDelegateClient.getDelegatedTokens).toHaveBeenCalledWith(mockWalletAddress);
            expect(mockHistorianClient.getTotalDelegatedAOByProject).toHaveBeenCalled();
            
            expect(result).toHaveLength(2);
            
            // First token should be delegated
            expect(result[0].ticker).toBe("TK1");
            expect(result[0].isDelegated).toBe(true);
            expect(result[0].totalDelegated).toBe("100");
            
            // Second token should not be delegated
            expect(result[1].ticker).toBe("TK2");
            expect(result[1].isDelegated).toBe(false);
            expect(result[1].totalDelegated).toBe("200");
        });

        it("should handle case when no delegation information is available", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            mockDelegateClient.getDelegatedTokens = jest.fn().mockResolvedValue([]);
            mockHistorianClient.getTotalDelegatedAOByProject = jest.fn().mockResolvedValue([]);
            
            // Act
            const result = await aggregator.getExtendedTokens(mockWalletAddress);
            
            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].isDelegated).toBe(false);
            expect(result[0].totalDelegated).toBe("0");
            expect(result[1].isDelegated).toBe(false);
            expect(result[1].totalDelegated).toBe("0");
        });

        it("should cache tokens and update delegation status when requested multiple times", async () => {
            // Arrange
            const mockWalletAddress1 = "wallet1";
            const mockWalletAddress2 = "wallet2";
            
            mockDelegateClient.getDelegatedTokens = jest.fn()
                .mockImplementation((wallet) => {
                    if (wallet === mockWalletAddress1) return Promise.resolve(["TK1"]);
                    if (wallet === mockWalletAddress2) return Promise.resolve(["TK2"]);
                    return Promise.resolve([]);
                });
            
            // Act - First call
            await aggregator.getExtendedTokens(mockWalletAddress1);
            
            // Should use cached tokens on second call
            mockOracleClient.getPITokens.mockClear();
            mockHistorianClient.getTotalDelegatedAOByProject.mockClear();
            
            // Act - Second call with different wallet
            const result = await aggregator.getExtendedTokens(mockWalletAddress2);
            
            // Assert
            expect(mockOracleClient.getPITokens).not.toHaveBeenCalled();  // Should use cached tokens
            expect(mockHistorianClient.getTotalDelegatedAOByProject).not.toHaveBeenCalled();  // Should use cached totals
            expect(mockDelegateClient.getDelegatedTokens).toHaveBeenCalledWith(mockWalletAddress2);
            
            expect(result[0].isDelegated).toBe(false);  // TK1 not delegated for wallet2
            expect(result[1].isDelegated).toBe(true);   // TK2 delegated for wallet2
        });
    });

    describe("updateTokens", () => {
        it("should update the token data", async () => {
            // Arrange
            const newTokens: PIToken[] = [
                { id: "token3", ticker: "TK3", process: "proc3", status: "active" }
            ];
            mockOracleClient.parsePITokens = jest.fn().mockReturnValue(newTokens);
            mockOracleClient.getPITokens = jest.fn().mockResolvedValue(JSON.stringify(newTokens));
            
            // Act
            await aggregator.updateTokens();
            
            // Get updated tokens
            const mockWalletAddress = "test-wallet";
            const result = await aggregator.getExtendedTokens(mockWalletAddress);
            
            // Assert
            expect(mockOracleClient.getPITokens).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].ticker).toBe("TK3");
        });
    });

    describe("updateDelegationTotals", () => {
        it("should update delegation totals", async () => {
            // Arrange
            const newTotals: ProjectDelegationTotal[] = [
                { projectId: "proc1", amount: "300" },
                { projectId: "proc3", amount: "400" }
            ];
            mockHistorianClient.getTotalDelegatedAOByProject = jest.fn().mockResolvedValue(newTotals);
            
            // Act
            await aggregator.updateDelegationTotals();
            
            // Get updated tokens with new totals
            const mockWalletAddress = "test-wallet";
            const result = await aggregator.getExtendedTokens(mockWalletAddress);
            
            // Assert
            expect(mockHistorianClient.getTotalDelegatedAOByProject).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0].totalDelegated).toBe("300");  // Updated value
            expect(result[1].totalDelegated).toBe("0");    // No total for proc2 anymore
        });
    });

    describe("getTokensMap", () => {
        it("should return a map of tokens by ticker", async () => {
            // Act
            const result = await aggregator.getTokensMap();
            
            // Assert
            expect(result).toBeInstanceOf(Map);
            expect(result.size).toBe(2);
            expect(result.has("TK1")).toBe(true);
            expect(result.has("TK2")).toBe(true);
            expect(result.get("TK1")).toEqual(mockTokens[0]);
            expect(result.get("TK2")).toEqual(mockTokens[1]);
        });
    });
});
