import { jest } from '@jest/globals';
import { PIService } from 'src/services/pi/PIService';
import { PIOracleClient } from 'src/clients/pi/oracle/PIOracleClient';
import { PIDelegateClient } from 'src/clients/pi/delegate/PIDelegateClient';
import { DelegationHistorianClient } from 'src/clients/pi/historian/DelegationHistorianClient';
import { PIToken } from 'src/clients/pi/oracle/abstract/IPIOracleClient';
import { DelegationPreference } from 'src/clients/pi/delegate/abstract/IPIDelegateClient';
import { DelegationRecord, ProjectDelegationTotal } from 'src/clients/pi/historian/IDelegationHistorianClient';
import { PITokenExtended } from 'src/services/pi/abstract/IPIService';

// Mock the client classes
jest.mock('src/clients/pi/oracle/PIOracleClient');
jest.mock('src/clients/pi/delegate/PIDelegateClient');
jest.mock('src/clients/pi/historian/DelegationHistorianClient');

describe('PIService', () => {
    let service: PIService;
    let mockOracleClient: jest.Mocked<PIOracleClient>;
    let mockDelegateClient: jest.Mocked<PIDelegateClient>;
    let mockHistorianClient: jest.Mocked<DelegationHistorianClient>;

    const testWalletAddress = 'test-wallet-address';
    const testTokens: PIToken[] = [
        { 
            tokenTicker: 'TK1', 
            tokenName: 'Token 1',
            owner: 'owner1',
            totalTokenSupplyAtCreation: '1000',
            piTokenProcess: 'process1',
            tokenProcess: 'specific1',
            delegationOracle: 'delegate1',
            // Add other required properties
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
        },
        { 
            tokenTicker: 'TK2', 
            tokenName: 'Token 2',
            owner: 'owner2',
            totalTokenSupplyAtCreation: '2000',
            piTokenProcess: 'process2',
            tokenProcess: 'specific2',
            delegationOracle: 'delegate2',
            // Add other required properties
            dataProtocol: 'protocol2',
            variant: 'variant2',
            type: 'type2',
            reference: 'ref2',
            tokenSupplyToUse: 'supply2',
            decayFactor: '0.7',
            tokenUnlockTimestamp: '123456999',
            tokenLogo: 'logo2',
            socials: 'socials2',
            flpFactory: 'factory2',
            areBatchTransfersPossible: true,
            accumulatedQuantity: '200',
            withdrawnQuantity: '100',
            exchangedForPiQuantity: '50',
            totalDistributionTicks: '20',
            yieldCycle: 'cycle2',
            distributedQuantity: '150',
            aoToken: 'ao2',
            areGeneralWithdrawalsEnabled: true,
            piProcess: 'pi2',
            tokenDisclaimer: 'disclaimer2',
            status: 'active',
            deployer: 'deployer2',
            treasury: 'treasury2',
            startsAtTimestamp: '123456800',
            distributionTick: '10',
            mintReporter: 'reporter2',
            withdrawnPiQuantity: '30',
            accumulatedPiQuantity: '180',
            tokenDenomination: 'denom2'
        }
    ];

    const testDelegationPreference: DelegationPreference = {
        walletTo: 'recipient-address',
        factor: 0.5
    };

    const testDelegationHistory: DelegationRecord[] = [
        {
            timestamp: 123456789,
            delegations: {
                "project1": "100",
                "project2": "200"
            }
        }
    ];

    const testTotalDelegated: ProjectDelegationTotal[] = [
        {
            projectId: 'project1',
            amount: '100'
        }
    ];

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Set up mock objects
        mockOracleClient = {
            getPITokens: jest.fn().mockResolvedValue(testTokens),
            getInfo: jest.fn(),
            builder: jest.fn().mockReturnThis() as any
        } as unknown as jest.Mocked<PIOracleClient>;

        mockDelegateClient = {
            getDelegation: jest.fn().mockResolvedValue(JSON.stringify(testDelegationPreference)),
            setDelegation: jest.fn().mockResolvedValue({ success: true, messageId: 'test-id' }),
            getInfo: jest.fn(),
            builder: jest.fn().mockReturnThis() as any
        } as unknown as jest.Mocked<PIDelegateClient>;

        mockHistorianClient = {
            getTotalDelegatedAOByProject: jest.fn().mockResolvedValue(testTotalDelegated),
            getLastRecord: jest.fn().mockResolvedValue(testDelegationHistory[0]),
            getLastNRecords: jest.fn().mockResolvedValue(testDelegationHistory),
            builder: jest.fn().mockReturnThis() as any
        } as unknown as jest.Mocked<DelegationHistorianClient>;
        
        // Create the service with mocked dependencies
        service = new PIService(
            mockOracleClient,
            mockDelegateClient,
            mockHistorianClient
        );
    });

    describe('getAllPITokens', () => {
        it('should return all PI tokens with extended information', async () => {
            // Act
            const result = await service.getAllPITokens();

            // Assert
            expect(mockOracleClient.getPITokens).toHaveBeenCalled();
            expect(result.length).toEqual(testTokens.length);
            expect(result[0].token.tokenTicker).toEqual(testTokens[0].tokenTicker);
        });

        it('should handle empty token list', async () => {
            // Arrange
            mockOracleClient.getPITokens = jest.fn().mockResolvedValue([]);

            // Act
            const result = await service.getAllPITokens();

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('getUserDelegations', () => {
        it('should get delegation data for a wallet', async () => {
            // Act
            const result = await service.getUserDelegations(testWalletAddress);

            // Assert
            expect(mockDelegateClient.getDelegation).toHaveBeenCalledWith(testWalletAddress);
            expect(result).toEqual(testDelegationPreference);
        });

        it('should handle null delegation response', async () => {
            // Arrange
            mockDelegateClient.getDelegation = jest.fn().mockResolvedValue(undefined);

            // Act
            const result = await service.getUserDelegations(testWalletAddress);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getDelegationHistory', () => {
        it('should get delegation history', async () => {
            // Act
            const result = await service.getDelegationHistory();

            // Assert
            expect(mockHistorianClient.getLastNRecords).toHaveBeenCalledWith(10); // Default limit is 10
            expect(result).toEqual(testDelegationHistory);
        });

        it('should pass limit parameter', async () => {
            // Arrange
            const limit = 5;
            
            // Act
            await service.getDelegationHistory(limit);

            // Assert
            expect(mockHistorianClient.getLastNRecords).toHaveBeenCalledWith(limit);
        });
    });

    describe('getTotalDelegatedAOByProject', () => {
        it('should get total delegated information', async () => {
            // Act
            const result = await service.getTotalDelegatedAOByProject();

            // Assert
            expect(mockHistorianClient.getTotalDelegatedAOByProject).toHaveBeenCalled();
            expect(result).toEqual(testTotalDelegated);
        });
    });

    describe('setDelegation', () => {
        it('should set delegation preference', async () => {
            // Arrange
            const expectedResult = { success: true, messageId: 'test-id' };
            mockDelegateClient.setDelegation = jest.fn().mockResolvedValue(expectedResult);

            // Act
            const result = await service.setDelegation(testDelegationPreference);

            // Assert
            expect(mockDelegateClient.setDelegation).toHaveBeenCalledWith(testDelegationPreference);
            expect(result).toEqual(expectedResult);
        });
    });
});
