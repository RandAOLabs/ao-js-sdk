import { jest } from '@jest/globals';
import { PIDataAggregator } from 'src/services/pi/PIDataAggregator';
import { PIOracleClient } from 'src/clients/pi/oracle/PIOracleClient';
import { PIDelegateClient } from 'src/clients/pi/delegate/PIDelegateClient';
import { DelegationHistorianClient } from 'src/clients/pi/historian/DelegationHistorianClient';
import { PIToken } from 'src/clients/pi/oracle/abstract/IPIOracleClient';
import { DelegationInfo, DelegationPreference } from 'src/clients/pi/delegate/abstract/IPIDelegateClient';
import { DelegationRecord, ProjectDelegationTotal } from 'src/clients/pi/historian/IDelegationHistorianClient';
import { PITokenClient } from 'src/clients/pi/PIToken/PITokenClient';
import { TokenClient } from 'src/clients/ao';
import { TickHistoryEntry } from 'src/clients/pi/PIToken/abstract/IPITokenClient';
import { PITokenExtended } from 'src/services/pi/abstract/IPIService';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';

// Mock the client classes
jest.mock('src/clients/pi/oracle/PIOracleClient');
jest.mock('src/clients/pi/delegate/PIDelegateClient');
jest.mock('src/clients/pi/historian/DelegationHistorianClient');
jest.mock('src/clients/pi/PIToken/PITokenClient');
jest.mock('src/clients/ao/token/TokenClient');

describe('PIDataAggregator', () => {
    let aggregator: PIDataAggregator;
    let mockOracleClient: jest.Mocked<PIOracleClient>;
    let mockDelegateClient: jest.Mocked<PIDelegateClient>;
    let mockHistorianClient: jest.Mocked<DelegationHistorianClient>;
    let mockPITokenClient: jest.Mocked<PITokenClient>;
    let mockTokenClient: jest.Mocked<TokenClient>;

    const mockWalletAddress = 'test-wallet-address';
    
    const mockTokens: PIToken[] = [
        { 
            ticker: 'TK1', 
            id: 'id1',
            process: 'process1',
            status: 'active',
            treasury: 'treasury1',
            name: 'Token 1',
            total_token_supply: '1000',
            flp_token_process: 'specific1',
            deployer: 'owner1'
        }
    ];

    const mockDelegationInfo: DelegationInfo = {
        wallet: mockWalletAddress,
        delegationPrefs: [
            {
                walletTo: 'process1',
                factor: 0.5
            }
        ],
        totalFactor: 0.5,
        lastUpdate: 123456789
    };

    const mockDelegationRecords: DelegationRecord[] = [
        {
            timestamp: 123456789,
            delegations: {
                'process1': '100'
            }
        }
    ];

    const mockProjectDelegations: ProjectDelegationTotal[] = [
        {
            projectId: 'process1',
            amount: '100'
        }
    ];

    const mockTickHistory: TickHistoryEntry[] = [
        {
            Timestamp: 123456789,
            TriggerMintReportIds: []
        }
    ];

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create a new aggregator
        aggregator = new PIDataAggregator();
        
        // Set up mock objects
        mockOracleClient = {
            getPITokens: jest.fn().mockResolvedValue(JSON.stringify(mockTokens)),
            parsePITokens: jest.fn().mockReturnValue(mockTokens),
            getInfo: jest.fn().mockResolvedValue({} as DryRunResult)
        } as unknown as jest.Mocked<PIOracleClient>;

        mockDelegateClient = {
            getDelegation: jest.fn().mockResolvedValue(JSON.stringify(mockDelegationInfo)),
            parseDelegationInfo: jest.fn().mockReturnValue(mockDelegationInfo)
        } as unknown as jest.Mocked<PIDelegateClient>;

        mockHistorianClient = {
            getTotalDelegatedAOByProject: jest.fn().mockResolvedValue(mockProjectDelegations),
            getLastNRecords: jest.fn().mockResolvedValue(mockDelegationRecords)
        } as unknown as jest.Mocked<DelegationHistorianClient>;

        mockPITokenClient = {
            getTickHistory: jest.fn().mockResolvedValue(JSON.stringify(mockTickHistory)),
            parseTickHistory: jest.fn().mockReturnValue(mockTickHistory)
        } as unknown as jest.Mocked<PITokenClient>;

        mockTokenClient = {} as unknown as jest.Mocked<TokenClient>;
    });

    describe('updateTokenData', () => {
        it('should update token data correctly', async () => {
            // Act
            await aggregator.updateTokenData(mockTokens[0]);

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            expect(tokens.length).toBe(1);
            expect(tokens[0].ticker).toBe(mockTokens[0].ticker);
        });

        it('should handle invalid token data gracefully', async () => {
            // Arrange
            const invalidToken = {} as PIToken;

            // Act
            await aggregator.updateTokenData(invalidToken);

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            expect(tokens.length).toBe(0);
        });
    });

    describe('updateDelegations', () => {
        it('should update delegation information correctly', async () => {
            // Arrange
            await aggregator.updateTokenData(mockTokens[0]);

            // Act
            await aggregator.updateDelegations(mockDelegationInfo);

            // Assert
            const info = aggregator.getDelegationInfo();
            expect(info).toBe(mockDelegationInfo);
        });
    });

    describe('updateDelegationHistory', () => {
        it('should update delegation history correctly', async () => {
            // Act
            await aggregator.updateDelegationHistory(mockDelegationRecords);

            // Assert
            const history = aggregator.getDelegationHistory();
            expect(history).toEqual(mockDelegationRecords);
        });
    });

    describe('updateProjectDelegations', () => {
        it('should update project delegation totals correctly', async () => {
            // Act
            await aggregator.updateProjectDelegations(mockProjectDelegations);

            // Assert
            const projects = aggregator.getProjectDelegations();
            expect(projects).toEqual(mockProjectDelegations);
        });
    });

    describe('updateTokenClients', () => {
        it('should associate token clients with a token', async () => {
            // Arrange
            const tokenId = 'process1';

            // Act
            await aggregator.updateTokenClients(tokenId, mockPITokenClient, mockTokenClient);
            
            // First add a token to make it detectable
            await aggregator.updateTokenData({ ...mockTokens[0], process: tokenId });

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            const token = tokens.find(t => t.process === tokenId);
            expect(token).toBeDefined();
            expect(token?.piTokenClient).toBe(mockPITokenClient);
            expect(token?.baseTokenClient).toBe(mockTokenClient);
        });
    });

    describe('updateTickHistory', () => {
        it('should update tick history for a token', async () => {
            // Arrange
            const tokenId = 'process1';
            
            // First add a token to make it detectable
            await aggregator.updateTokenData({ ...mockTokens[0], process: tokenId });

            // Act
            await aggregator.updateTickHistory(tokenId, mockTickHistory);

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            const token = tokens.find(t => t.process === tokenId);
            expect(token).toBeDefined();
            expect(token?.tickHistory).toEqual(mockTickHistory);
        });
    });

    describe('getAggregatedTokens', () => {
        it('should return the aggregated token data', async () => {
            // Arrange
            await aggregator.updateTokenData(mockTokens[0]);
            await aggregator.updateDelegations(mockDelegationInfo);
            await aggregator.updateDelegationHistory(mockDelegationRecords);
            await aggregator.updateProjectDelegations(mockProjectDelegations);

            // Act
            const tokens = aggregator.getAggregatedTokens();

            // Assert
            expect(tokens.length).toBe(1);
            expect(tokens[0].ticker).toBe(mockTokens[0].ticker);
        });

        it('should return an empty array when no tokens exist', () => {
            // Act
            const tokens = aggregator.getAggregatedTokens();

            // Assert
            expect(tokens).toEqual([]);
        });
    });
});
