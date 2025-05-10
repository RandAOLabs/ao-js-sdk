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
            tokenTicker: 'TK1', 
            tokenName: 'Token 1',
            owner: 'owner1',
            totalTokenSupplyAtCreation: '1000',
            piTokenProcess: 'process1',
            tokenProcess: 'specific1',
            delegationOracle: 'delegate1',
            // Add other required PIToken properties
            dataProtocol: 'protocol1',
            variant: 'variant1',
            type: 'type1',
            reference: 'ref1',
            tokenSupplyToUse: 'supply1',
            decayFactor: '0.5',
            tokenUnlockTimestamp: '123456789',
            tokenLogo: 'logo1',
            socials: 'socials1',
            flpFactory: 'factory1',
            areBatchTransfersPossible: true,
            accumulatedQuantity: '100',
            withdrawnQuantity: '50',
            exchangedForPiQuantity: '25',
            totalDistributionTicks: '10',
            yieldCycle: 'cycle1',
            distributedQuantity: '75',
            aoToken: 'ao1',
            areGeneralWithdrawalsEnabled: true,
            piProcess: 'pi1',
            tokenDisclaimer: 'disclaimer1',
            status: 'active',
            deployer: 'deployer1',
            treasury: 'treasury1',
            startsAtTimestamp: '123456700',
            distributionTick: '5',
            mintReporter: 'reporter1',
            withdrawnPiQuantity: '15',
            accumulatedPiQuantity: '90',
            tokenDenomination: 'denom1'
        }
    ];

    const mockDelegationInfo: DelegationInfo = {
        wallet: mockWalletAddress,
        delegationPrefs: [
            {
                walletTo: 'process1',
                factor: 0.5
            }
        ]
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
            getPITokens: jest.fn().mockResolvedValue(mockTokens)
        } as unknown as jest.Mocked<PIOracleClient>;

        mockDelegateClient = {
            getDelegation: jest.fn().mockResolvedValue(JSON.stringify(mockDelegationInfo))
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
            expect(tokens[0].tokenTicker).toBe(mockTokens[0].tokenTicker);
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
            await aggregator.updateTokenData({ ...mockTokens[0], piTokenProcess: tokenId });

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            const token = tokens.find(t => t.piTokenProcess === tokenId);
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
            await aggregator.updateTokenData({ ...mockTokens[0], piTokenProcess: tokenId });

            // Act
            await aggregator.updateTickHistory(tokenId, mockTickHistory);

            // Assert
            const tokens = aggregator.getAggregatedTokens();
            const token = tokens.find(t => t.piTokenProcess === tokenId);
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
            expect(tokens[0].tokenTicker).toBe(mockTokens[0].tokenTicker);
        });

        it('should return an empty array when no tokens exist', () => {
            // Act
            const tokens = aggregator.getAggregatedTokens();

            // Assert
            expect(tokens).toEqual([]);
        });
    });
});
