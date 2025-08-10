import { jest } from '@jest/globals';
import { PIOracleClient } from 'src/clients/pi/oracle/PIOracleClient';
import { PIDelegateClient } from 'src/clients/pi/delegate/PIDelegateClient';
import { DelegationHistorianClient } from 'src/clients/pi/historian/DelegationHistorianClient';
import { PIToken } from 'src/clients/pi/oracle/abstract/IPIOracleClient';
import { DelegationInfo, SetDelegationOptions } from 'src/clients/pi/delegate/abstract/IPIDelegateClient';
import { DelegationRecord, ProjectDelegationTotal } from 'src/clients/pi/historian/IDelegationHistorianClient';
import { DryRunResult } from '../../../../../src/core/ao/abstract';
import { PIService } from '../../../../../src';


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
			ticker: 'TK1',
			id: 'id1',
			process: 'process1',
			status: 'active',
			treasury: 'treasury1'
		},
		{
			ticker: 'TK2',
			id: 'id2',
			process: 'process2',
			status: 'active',
			treasury: 'treasury2'
		}
	];

	const testDelegationInfo: DelegationInfo = {
		wallet: testWalletAddress,
		delegationPrefs: [
			{
				walletTo: 'recipient-address',
				factor: 0.5
			}
		],
		totalFactor: "0.5",
		lastUpdate: 123456789
	};

	const testDelegationRecords: DelegationRecord[] = [
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

		// Create mock clients using type casting to solve TypeScript issues
		mockOracleClient = {
			getPITokens: jest.fn(),
			parsePITokens: jest.fn() as unknown as jest.MockedFunction<(piTokensData: string) => PIToken[]>,
			getInfo: jest.fn(),
			createTokenClientPairsArray: jest.fn()
		} as unknown as jest.Mocked<PIOracleClient>;

		mockDelegateClient = {
			getDelegation: jest.fn(),
			parseDelegationInfo: jest.fn() as unknown as jest.MockedFunction<(delegationData: string) => DelegationInfo>,
			setDelegation: jest.fn(),
			getInfo: jest.fn()
		} as unknown as jest.Mocked<PIDelegateClient>;

		mockHistorianClient = {
			getTotalDelegatedAOByProject: jest.fn(),
			getLastRecord: jest.fn(),
			getLastNRecords: jest.fn()
			// Note: DelegationHistorianClient interface doesn't include getInfo method
		} as unknown as jest.Mocked<DelegationHistorianClient>;

		// Set up return values after creating the mock objects
		mockOracleClient.getPITokens.mockResolvedValue(JSON.stringify(testTokens));
		mockOracleClient.parsePITokens.mockReturnValue(testTokens);
		mockOracleClient.getInfo.mockResolvedValue({} as DryRunResult);
		mockOracleClient.createTokenClientPairsArray.mockResolvedValue([]);

		mockDelegateClient.getDelegation.mockResolvedValue(JSON.stringify(testDelegationInfo));
		mockDelegateClient.parseDelegationInfo.mockReturnValue(testDelegationInfo);
		mockDelegateClient.setDelegation.mockResolvedValue('test-message-id');
		mockDelegateClient.getInfo.mockResolvedValue({} as DryRunResult);

		mockHistorianClient.getTotalDelegatedAOByProject.mockResolvedValue(testTotalDelegated);
		mockHistorianClient.getLastRecord.mockResolvedValue(testDelegationRecords[0]);
		mockHistorianClient.getLastNRecords.mockResolvedValue(testDelegationRecords);

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
			expect(mockOracleClient.getPITokens).toHaveBeenCalledTimes(1);
			expect(result.length).toEqual(testTokens.length);
			expect(result[0].ticker).toEqual(testTokens[0].ticker); // Fixed: access ticker directly, not through token property
		});

		it('should handle empty tokens array from oracle', async () => {
			// Arrange - reset the mock implementation to return empty array
			mockOracleClient.parsePITokens.mockReturnValue([]);

			// Act
			const result = await service.getAllPITokens();

			// Assert
			expect(result).toEqual([]);
			expect(mockOracleClient.getPITokens).toHaveBeenCalledTimes(1);
			expect(mockOracleClient.parsePITokens).toHaveBeenCalledTimes(1);
		});
	});

	describe('getUserDelegations', () => {
		it('should get delegation data for a wallet', async () => {
			// Act
			const result = await service.getUserDelegations(testWalletAddress);

			// Assert
			expect(mockDelegateClient.getDelegation).toHaveBeenCalledTimes(1);
			expect(mockDelegateClient.parseDelegationInfo).toHaveBeenCalledTimes(1);
			expect(result).toEqual(testDelegationInfo);
		});

		it('should handle error parsing delegation info', async () => {
			// Arrange - modify the mock implementation without reassignment
			// Cast to any to allow null return value in this test scenario
			(mockDelegateClient.parseDelegationInfo as jest.Mock<any>).mockReturnValue(null);

			// Act
			const result = await service.getUserDelegations(testWalletAddress);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe('getDelegationHistory', () => {
		it('should get delegation history with default count', async () => {
			// Arrange
			const defaultCount = 10;

			// Act
			const result = await service.getDelegationHistory(defaultCount);

			// Assert
			expect(mockHistorianClient.getLastNRecords).toHaveBeenCalledWith(defaultCount);
			expect(result).toEqual(testDelegationRecords);
		});

		it('should pass custom count parameter', async () => {
			// Arrange
			const customCount = 5;

			// Act
			await service.getDelegationHistory(customCount);

			// Assert
			expect(mockHistorianClient.getLastNRecords).toHaveBeenCalledWith(customCount);
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
			const walletFrom = 'sender-address';
			const walletTo = 'recipient-address';
			const factor = 0.5;
			const expectedOptions: SetDelegationOptions = {
				walletFrom,
				walletTo,
				factor
			};
			const expectedResult = 'test-message-id';

			// Act
			const result = await service.setDelegation(walletFrom, walletTo, factor);

			// Assert
			expect(mockDelegateClient.setDelegation).toHaveBeenCalledWith(expectedOptions);
			expect(result).toEqual(expectedResult);
		});
	});
});
