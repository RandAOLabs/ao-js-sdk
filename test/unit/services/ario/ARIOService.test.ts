import { ANTClient } from 'src/clients/ario/ant';
import { ARNSClient, ARNSRecordResponse } from 'src/clients/ario/arns';
import { ARNSRecord } from 'src/clients/ario/arns/types';
import { BaseClientConfig } from 'src/core/ao/configuration';
import { AntRecord, ANTRecordNotFoundError, ARIOService, ARNSRecordNotFoundError } from '../../../../src';
import { ARN_ROOT_NAME } from '../../../../src/services/ario/ario-service/constants';

// Mock the clients
jest.mock('src/clients/ario/ant');
jest.mock('src/clients/ario/arns');

describe('ARIOService', () => {
	let service: ARIOService;
	let mockArnsClient: jest.Mocked<ARNSClient>;
	let mockAntClient: jest.Mocked<ANTClient>;

	beforeEach(() => {
		// Clear singleton instance
		(ARIOService as any).instance = undefined;

		// Setup mocks with required DryRunCachingClient methods
		mockArnsClient = {
			getRecord: jest.fn(),
			dryrun: jest.fn(),
			getFirstMessageDataJson: jest.fn(),
			getProcessId: jest.fn(),
			message: jest.fn(),
			messageResult: jest.fn(),
			result: jest.fn(),
			results: jest.fn(),
			setDryRunAsMessage: jest.fn(),
			getProcessInfo: jest.fn(),
			getCallingWalletAddress: jest.fn(),
			isRunningDryRunsAsMessages: jest.fn(),
			clearCache: jest.fn(),
			getWallet: jest.fn()
		} as any;

		mockAntClient = {
			getRecord: jest.fn(),
			dryrun: jest.fn(),
			getFirstMessageDataJson: jest.fn(),
			getProcessId: jest.fn(),
			message: jest.fn(),
			messageResult: jest.fn(),
			result: jest.fn(),
			results: jest.fn(),
			setDryRunAsMessage: jest.fn(),
			getProcessInfo: jest.fn(),
			getCallingWalletAddress: jest.fn(),
			isRunningDryRunsAsMessages: jest.fn(),
			clearCache: jest.fn()
		} as any;

		// Mock the constructors to return our mocks
		jest.mocked(ARNSClient).mockImplementation((config: BaseClientConfig) => mockArnsClient);
		jest.mocked(ANTClient).mockImplementation((config: BaseClientConfig) => mockAntClient);

		// Create service instance with empty cache config
		service = ARIOService.getInstance({
			arnsClient: mockArnsClient
		});
	});

	describe('getProcessIdForDomain', () => {
		it('should use cached ANT client for same ANT name', async () => {
			// Setup
			const domain1 = 'nft_randao';
			const domain2 = 'other_randao';
			const processId = 'process123';
			const txId = 'tx123';
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: '1212'
			}

			const antrecord: AntRecord = {
				transactionId: '3YxCUcMRTNz2lb3Y9sdWnwYfSOZABIvdfGL8yGEqTn8',
				ttlSeconds: 0
			}
			mockArnsClient.getRecord.mockResolvedValue(arnsRecordResponse);
			mockAntClient.getRecord.mockResolvedValue(antrecord);

			// Execute
			await service.getProcessIdForDomain(domain1);
			await service.getProcessIdForDomain(domain2);

			// Verify ANTClient was only constructed once for 'randao'
			expect(ANTClient).toHaveBeenCalledTimes(1);
			expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
				processId: expect.any(String),
				wallet: expect.anything()
			}));
		});

		it('should get process ID for simple domain', async () => {
			// Setup
			const domain = 'randao';
			const processId = 'process123';
			const txId = 'tx123';

			const antrecord: AntRecord = {
				transactionId: txId,
				ttlSeconds: 0
			}
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: '1212'
			}
			mockArnsClient.getRecord.mockResolvedValueOnce(arnsRecordResponse);
			mockAntClient.getRecord.mockResolvedValueOnce(antrecord);

			// Execute
			const result = await service.getProcessIdForDomain(domain);

			// Verify
			expect(result).toBe(txId);
			expect(mockArnsClient.getRecord).toHaveBeenCalledWith(domain);
			expect(mockAntClient.getRecord).toHaveBeenCalledWith(ARN_ROOT_NAME);
			expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
				processId: expect.any(String),
				wallet: expect.anything()
			}));
		});

		it('should get process ID for domain with undername', async () => {
			// Setup
			const domain = 'nft_randao';
			const processId = 'process123';
			const txId = 'tx123';

			const antrecord: AntRecord = {
				transactionId: txId,
				ttlSeconds: 0
			}
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: '1212'
			}
			mockArnsClient.getRecord.mockResolvedValueOnce(arnsRecordResponse);
			mockAntClient.getRecord.mockResolvedValueOnce(antrecord);

			// Execute
			const result = await service.getProcessIdForDomain(domain);

			// Verify
			expect(result).toBe(txId);
			expect(mockAntClient.getRecord).toHaveBeenCalledWith('nft');
			expect(ANTClient).toHaveBeenCalledWith(expect.objectContaining({
				processId: expect.any(String),
				wallet: expect.anything()
			}));
		});

		it('should throw ARNSRecordNotFoundError when ARNS record not found', async () => {
			// Setup
			const domain = 'randao';
			mockArnsClient.getRecord.mockResolvedValueOnce(undefined);

			// Execute & Verify
			await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ARNSRecordNotFoundError);
		});

		it('should throw ARNSRecordNotFoundError when ARNS record has no processId', async () => {
			// Setup
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: ''
			}
			const domain = 'randao';
			mockArnsClient.getRecord.mockResolvedValueOnce(arnsRecordResponse);

			// Execute & Verify
			await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ARNSRecordNotFoundError);
		});

		it('should throw ANTRecordNotFoundError when ANT record not found', async () => {
			// Setup
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: '1212'
			}
			const domain = 'randao';
			mockArnsClient.getRecord.mockResolvedValueOnce(arnsRecordResponse);
			mockAntClient.getRecord.mockResolvedValueOnce(undefined);

			// Execute & Verify
			await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ANTRecordNotFoundError);
		});

		it('should throw ANTRecordNotFoundError when ANT record has no transactionId', async () => {
			// Setup
			const domain = 'randao';
			const arnsRecordResponse: ARNSRecordResponse = {
				startTimestamp: 0,
				endTimestamp: 0,
				type: '',
				purchasePrice: 0,
				undernameLimit: 0,
				processId: '1212'
			}
			mockArnsClient.getRecord.mockResolvedValueOnce(arnsRecordResponse);
			mockAntClient.getRecord.mockResolvedValueOnce({ name: ARN_ROOT_NAME } as unknown as AntRecord);

			// Execute & Verify
			await expect(service.getProcessIdForDomain(domain)).rejects.toThrow(ANTRecordNotFoundError);
		});
	});
});
