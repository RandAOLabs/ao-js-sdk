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

import { PIService } from "src/services/pi/PIService";
import { PIDataAggregator } from "src/services/pi/PIDataAggregator";
import { PIOracleClient } from "src/clients/pi/oracle/PIOracleClient";
import { PIDelegateClient } from "src/clients/pi/delegate/PIDelegateClient";
import { DelegationHistorianClient } from "src/clients/pi/historian/DelegationHistorianClient";
import { PIToken } from "src/clients/pi/oracle/abstract/IPIOracleClient";
import { DelegationPreferences } from "src/clients/pi/delegate/abstract/IPIDelegateClient";
import { PITokenExtended } from "src/services/pi/abstract/types";
import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { PITokenClient } from "src/clients/pi/PIToken/PITokenClient";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

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
jest.mock("src/clients/pi/PIToken/PITokenClient");
jest.mock("src/services/pi/PIDataAggregator");

describe("PIService", () => {
    let piService: PIService;
    let mockOracleClient: jest.Mocked<PIOracleClient>;
    let mockDelegateClient: jest.Mocked<PIDelegateClient>;
    let mockHistorianClient: jest.Mocked<DelegationHistorianClient>;
    let mockDataAggregator: jest.Mocked<PIDataAggregator>;

    const mockTokens: PIToken[] = [
        { id: "token1", ticker: "TK1", process: "proc1", status: "active" },
        { id: "token2", ticker: "TK2", process: "proc2", status: "active" }
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create mock instances
        mockOracleClient = new PIOracleClient({} as any) as jest.Mocked<PIOracleClient>;
        mockDelegateClient = new PIDelegateClient({} as any) as jest.Mocked<PIDelegateClient>;
        mockHistorianClient = new DelegationHistorianClient({} as any) as jest.Mocked<DelegationHistorianClient>;
        mockDataAggregator = new PIDataAggregator(
            mockOracleClient,
            mockDelegateClient,
            mockHistorianClient
        ) as jest.Mocked<PIDataAggregator>;
        
        // Mock the getPITokens method
        mockOracleClient.parsePITokens = jest.fn().mockReturnValue(mockTokens);
        mockOracleClient.getPITokens = jest.fn().mockResolvedValue(JSON.stringify(mockTokens));
        mockOracleClient.createTokenClientPairs = jest.fn().mockResolvedValue(new Map());
        
        // Mock the delegate client methods
        mockDelegateClient.getDelegatedTokens = jest.fn().mockResolvedValue(["TK1"]);
        mockDelegateClient.isDelegatedToken = jest.fn().mockImplementation((ticker) => Promise.resolve(ticker === "TK1"));
        
        // Mock the historian client methods
        mockHistorianClient.getTotalDelegatedAOByProject = jest.fn().mockResolvedValue([
            { projectId: "proc1", amount: "100" },
            { projectId: "proc2", amount: "200" }
        ]);
        
        // Create the service
        piService = new PIService(
            mockOracleClient,
            mockDelegateClient,
            mockHistorianClient,
            mockDataAggregator
        );
    });

    describe("getExtendedPITokens", () => {
        it("should return extended PI tokens with delegation status and totals", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            const mockExtendedTokens: PITokenExtended[] = [
                { 
                    ...mockTokens[0], 
                    isDelegated: true, 
                    totalDelegated: "100" 
                },
                { 
                    ...mockTokens[1], 
                    isDelegated: false, 
                    totalDelegated: "200" 
                }
            ];
            mockDataAggregator.getExtendedTokens = jest.fn().mockResolvedValue(mockExtendedTokens);
            
            // Act
            const result = await piService.getExtendedPITokens(mockWalletAddress);
            
            // Assert
            expect(mockDataAggregator.getExtendedTokens).toHaveBeenCalledWith(mockWalletAddress);
            expect(result).toEqual(mockExtendedTokens);
        });
    });

    describe("getDelegatedPITokens", () => {
        it("should return delegated tokens", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            const mockExtendedTokens: PITokenExtended[] = [
                { 
                    ...mockTokens[0], 
                    isDelegated: true, 
                    totalDelegated: "100" 
                },
                { 
                    ...mockTokens[1], 
                    isDelegated: false, 
                    totalDelegated: "200" 
                }
            ];
            mockDataAggregator.getExtendedTokens = jest.fn().mockResolvedValue(mockExtendedTokens);
            
            // Act
            const result = await piService.getDelegatedPITokens(mockWalletAddress);
            
            // Assert
            expect(mockDataAggregator.getExtendedTokens).toHaveBeenCalledWith(mockWalletAddress);
            expect(result).toEqual([mockExtendedTokens[0]]);
        });
    });

    describe("setDelegation", () => {
        it("should set delegation preferences", async () => {
            // Arrange
            const delegationPrefs: DelegationPreferences = {
                address: "test-wallet",
                delegatedTokens: ["TK1", "TK2"]
            };
            mockDelegateClient.setDelegation = jest.fn().mockResolvedValue(true);
            
            // Act
            const result = await piService.setDelegation(delegationPrefs);
            
            // Assert
            expect(mockDelegateClient.setDelegation).toHaveBeenCalledWith(delegationPrefs);
            expect(result).toBe(true);
        });
    });

    describe("getDelegation", () => {
        it("should get delegation preferences", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            const mockDelegation = {
                address: mockWalletAddress,
                delegatedTokens: ["TK1"]
            };
            mockDelegateClient.getDelegation = jest.fn().mockResolvedValue(mockDelegation);
            
            // Act
            const result = await piService.getDelegation(mockWalletAddress);
            
            // Assert
            expect(mockDelegateClient.getDelegation).toHaveBeenCalledWith(mockWalletAddress);
            expect(result).toEqual(mockDelegation);
        });
    });

    describe("getDelegatedTokens", () => {
        it("should get delegated tokens", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            mockDelegateClient.getDelegatedTokens = jest.fn().mockResolvedValue(["TK1"]);
            
            // Act
            const result = await piService.getDelegatedTokens(mockWalletAddress);
            
            // Assert
            expect(mockDelegateClient.getDelegatedTokens).toHaveBeenCalledWith(mockWalletAddress);
            expect(result).toEqual(["TK1"]);
        });
    });

    describe("isDelegatedToken", () => {
        it("should check if token is delegated", async () => {
            // Arrange
            const mockWalletAddress = "test-wallet";
            const tokenTicker = "TK1";
            mockDelegateClient.isDelegatedToken = jest.fn().mockResolvedValue(true);
            
            // Act
            const result = await piService.isDelegatedToken(tokenTicker, mockWalletAddress);
            
            // Assert
            expect(mockDelegateClient.isDelegatedToken).toHaveBeenCalledWith(tokenTicker, mockWalletAddress);
            expect(result).toBe(true);
        });
    });

    describe("getTotalDelegatedAOByProject", () => {
        it("should get total delegated AO by project", async () => {
            // Arrange
            const mockTotals = [
                { projectId: "proc1", amount: "100" },
                { projectId: "proc2", amount: "200" }
            ];
            mockHistorianClient.getTotalDelegatedAOByProject = jest.fn().mockResolvedValue(mockTotals);
            
            // Act
            const result = await piService.getTotalDelegatedAOByProject();
            
            // Assert
            expect(mockHistorianClient.getTotalDelegatedAOByProject).toHaveBeenCalled();
            expect(result).toEqual(mockTotals);
        });
    });

    describe("getLastDelegationRecord", () => {
        it("should get last delegation record", async () => {
            // Arrange
            const mockRecord = {
                delegationsTimestamp: 123456789,
                delegations: []
            };
            mockHistorianClient.getLastRecord = jest.fn().mockResolvedValue(mockRecord);
            
            // Act
            const result = await piService.getLastDelegationRecord();
            
            // Assert
            expect(mockHistorianClient.getLastRecord).toHaveBeenCalled();
            expect(result).toEqual(mockRecord);
        });
    });

    describe("getPITokens", () => {
        it("should get PI tokens", async () => {
            // Act
            const result = await piService.getPITokens();
            
            // Assert
            expect(mockOracleClient.getPITokens).toHaveBeenCalled();
            expect(mockOracleClient.parsePITokens).toHaveBeenCalledWith(JSON.stringify(mockTokens));
            expect(result).toEqual(mockTokens);
        });
    });

    describe("createTokenClientPairs", () => {
        it("should create token client pairs", async () => {
            // Arrange
            const mockClientPairs = new Map();
            mockClientPairs.set("TK1", [new PITokenClient({} as any), {} as any]);
            mockOracleClient.createTokenClientPairs = jest.fn().mockResolvedValue(mockClientPairs);
            
            // Act
            const result = await piService.createTokenClientPairs();
            
            // Assert
            expect(mockOracleClient.createTokenClientPairs).toHaveBeenCalled();
            expect(result).toBe(mockClientPairs);
        });
    });

    describe("autoConfiguration", () => {
        it("should create a pre-configured instance", async () => {
            // Mock the static methods
            const originalBuilder = PIOracleClient.builder;
            PIOracleClient.builder = jest.fn().mockReturnValue({
                withProcessId: jest.fn().mockReturnThis(),
                withAOConfig: jest.fn().mockReturnThis(),
                build: jest.fn().mockReturnValue(mockOracleClient)
            });

            const originalDelegateBuilder = PIDelegateClient.builder;
            PIDelegateClient.builder = jest.fn().mockReturnValue({
                withProcessId: jest.fn().mockReturnThis(),
                withAOConfig: jest.fn().mockReturnThis(),
                build: jest.fn().mockReturnValue(mockDelegateClient)
            });

            const originalHistorianBuilder = DelegationHistorianClient.builder;
            DelegationHistorianClient.builder = jest.fn().mockReturnValue({
                withProcessId: jest.fn().mockReturnThis(),
                withAOConfig: jest.fn().mockReturnThis(),
                build: jest.fn().mockReturnValue(mockHistorianClient)
            });

            try {
                // Act
                const service = await PIService.autoConfiguration();
                
                // Assert
                expect(service).toBeInstanceOf(PIService);
                expect(PIOracleClient.builder).toHaveBeenCalled();
                expect(PIDelegateClient.builder).toHaveBeenCalled();
                expect(DelegationHistorianClient.builder).toHaveBeenCalled();
            } finally {
                // Restore the original methods
                PIOracleClient.builder = originalBuilder;
                PIDelegateClient.builder = originalDelegateBuilder;
                DelegationHistorianClient.builder = originalHistorianBuilder;
            }
        });
    });
});
