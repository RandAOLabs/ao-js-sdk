import { BaseClient } from 'src/core/ao/BaseClient';
import { BaseClientConfigBuilder } from 'src/core/ao/configuration/builder';
import { DEFAULT_TAGS } from 'src/core/ao/constants';
import { SortOrder } from '../../../../src/core/ao/abstract/types';

// Create mock functions for IAOClient implementation
const message = jest.fn();
const results = jest.fn();
const result = jest.fn();
const dryrun = jest.fn();
const getCallingWalletAddress = jest.fn();
const getWallet = jest.fn();
const isReadOnly = jest.fn();
const getActiveConfig = jest.fn();

// Mock AOClientBuilder
jest.mock('src/core/ao/ao-client/AOClientBuilder', () => {
	return {
		AOClientBuilder: jest.fn().mockImplementation(() => ({
			withWallet: jest.fn().mockReturnThis(),
			withAOConfig: jest.fn().mockReturnThis(),
			withRetriesEnabled: jest.fn().mockReturnThis(),
			build: jest.fn().mockReturnValue({
				message,
				results,
				result,
				dryrun,
				getCallingWalletAddress,
				getWallet,
				isReadOnly,
				getActiveConfig
			})
		}))
	};
});

// Mock client implementations
jest.mock('src/core/ao/ao-client/implementations/WriteReadAOClient', () => {
	return {
		WriteReadAOClient: jest.fn().mockImplementation(() => ({
			message,
			results,
			result,
			dryrun,
			getCallingWalletAddress
		}))
	};
});

jest.mock('src/core/ao/ao-client/implementations/WriteReadRetryAOClient', () => {
	return {
		WriteReadRetryAOClient: jest.fn().mockImplementation(() => ({
			message,
			results,
			result,
			dryrun,
			getCallingWalletAddress
		}))
	};
});

jest.mock('src/core/ao/ao-client/implementations/ReadOnlyAOClient', () => {
	return {
		ReadOnlyAOClient: jest.fn().mockImplementation(() => ({
			results,
			result,
			dryrun
		}))
	};
});

jest.mock('src/core/ao/ao-client/implementations/ReadOnlyRetryClient', () => {
	return {
		ReadOnlyRetryAOClient: jest.fn().mockImplementation(() => ({
			results,
			result,
			dryrun
		}))
	};
});


// Mock ArweaveDataCachingService
jest.mock('src/core/arweave/ArweaveDataCachingService', () => {
	return {
		ArweaveDataCachingService: {
			autoConfiguration: jest.fn().mockReturnValue({
				getTransactionById: jest.fn()
			})
		}
	};
});

// Mock logger
jest.mock('src/utils/logger/logger', () => ({
	Logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

describe("BaseClient", () => {
	// Variable to hold the BaseClient instance
	let client: BaseClient;

	// Setting up mocks and BaseClient instance before each test
	beforeEach(() => {
		// Reset all mocks first
		jest.clearAllMocks();

		// Set up default mock return values
		isReadOnly.mockReturnValue(false); // Default to write-enabled client
		getWallet.mockReturnValue({
			kty: "RSA",
			n: "test-modulus",
			e: "test-exponent",
			d: "test-private-exponent",
			p: "test-prime-1",
			q: "test-prime-2",
			dp: "test-exponent-1",
			dq: "test-exponent-2",
			qi: "test-coefficient"
		});
		getActiveConfig.mockReturnValue({});

		const config = new BaseClientConfigBuilder()
			.withProcessId("test-process-id")
			.withWallet({
				kty: "RSA",
				n: "test-modulus",
				e: "test-exponent",
				d: "test-private-exponent",
				p: "test-prime-1",
				q: "test-prime-2",
				dp: "test-exponent-1",
				dq: "test-exponent-2",
				qi: "test-coefficient"
			}) // Mock JWKInterface wallet
			.build()
		client = new BaseClient(config)
	});

	// Reset mocks after each test
	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test case: Constructor initializes correctly
	 */
	describe('Autoconfiguration Constructor', () => {
		it('should initialize with correct processId and signer', () => {
			expect(client.baseConfig).toBeDefined();
		});
	});

	/**
	 * Test case: Sending a message
	 */
	describe('message()', () => {
		it('should send a message with correct parameters', async () => {
			// Arrange
			(message as jest.Mock).mockResolvedValueOnce(undefined);
			const data = 'test-data';
			const tags = [{ name: 'tag1', value: 'value1' }];
			const anchor = 'anchor123';

			// Act
			await expect(client.message(data, tags, anchor)).resolves.toBeUndefined();

			// Assert
			const expectedTags = [
				{ name: 'tag1', value: 'value1' },
				...DEFAULT_TAGS,
			];
			expect(message).toHaveBeenCalledWith(
				client.baseConfig.processId,
				data,
				expectedTags,
				anchor
			);
		});
	});

	/**
	 * Test case: Fetching multiple results
	 */
	describe('results()', () => {
		it('should fetch results with correct parameters and return data', async () => {
			// Arrange
			const mockResponse = [{ id: '1', data: 'result1' }];
			(results as jest.Mock).mockResolvedValueOnce(mockResponse);
			const from = 'start-id';
			const to = 'end-id';
			const limit = 10;
			const sort = SortOrder.DESCENDING;

			// Act
			const response = await client.results(from, to, limit, sort);

			// Assert
			expect(results).toHaveBeenCalledWith({
				process: client.baseConfig.processId,
				from,
				to,
				limit,
				sort
			});
			expect(response).toEqual(mockResponse);
		});
	});

	/**
	 * Test case: Fetching a single result by message ID
	 */
	describe('result()', () => {
		it('should fetch a result by message ID with correct parameters', async () => {
			// Arrange
			const mockResponse = { id: 'message-id', data: 'result-data' };
			(result as jest.Mock).mockResolvedValueOnce(mockResponse);
			const messageId = 'message-id';

			// Act
			const response = await client.result(messageId);

			// Assert
			expect(result).toHaveBeenCalledWith({
				process: client.baseConfig.processId,
				message: messageId
			});
			expect(response).toEqual(mockResponse);
		});
	});

	/**
	 * Test case: Getting wallet address
	 */
	describe('getCallingWalletAddress()', () => {
		it('should return the wallet address', async () => {
			// Arrange
			const mockAddress = "test-wallet-address";
			getCallingWalletAddress.mockResolvedValueOnce(mockAddress);

			// Act
			const address = await client.getCallingWalletAddress();

			// Assert
			expect(getCallingWalletAddress).toHaveBeenCalled();
			expect(address).toBe(mockAddress);
		});
	});

	/**
	 * Test case: Performing a dry run
	 */
	describe('dryrun()', () => {
		it('should perform a dry run with correct parameters', async () => {
			// Arrange
			const mockResponse = { success: true };
			(dryrun as jest.Mock).mockResolvedValueOnce(mockResponse);
			const data = 'test-data';
			const tags = [{ name: 'tag1', value: 'value1' }];
			const anchor = 'anchor123';
			const id = 'test-id';
			const owner = 'test-owner';

			// Act
			const response = await client.dryrun(data, tags, anchor, id, owner);

			// Assert
			const expectedTags = [
				{ name: 'tag1', value: 'value1' },
				...DEFAULT_TAGS,
			];
			expect(dryrun).toHaveBeenCalledWith({
				process: client.baseConfig.processId,
				data,
				tags: expectedTags,
				anchor,
				id,
				owner,
			});
			expect(response).toEqual(mockResponse);
		});
	});

	/**
	 * Test case: Checking if client is read-only
	 */
	describe('isReadOnly()', () => {
		it('should return false for write-enabled client', () => {
			// Arrange
			isReadOnly.mockReturnValue(false);

			// Act
			const readOnly = client.isReadOnly();

			// Assert
			expect(isReadOnly).toHaveBeenCalled();
			expect(readOnly).toBe(false);
		});

		it('should return true for read-only client', () => {
			// Arrange
			isReadOnly.mockReturnValue(true);

			// Act
			const readOnly = client.isReadOnly();

			// Assert
			expect(isReadOnly).toHaveBeenCalled();
			expect(readOnly).toBe(true);
		});
	});

	/**
	 * Test case: Getting wallet
	 */
	describe('getWallet()', () => {
		it('should return the wallet object', () => {
			// Arrange
			const mockWallet = {
				kty: "RSA",
				n: "test-modulus",
				e: "test-exponent",
				d: "test-private-exponent",
				p: "test-prime-1",
				q: "test-prime-2",
				dp: "test-exponent-1",
				dq: "test-exponent-2",
				qi: "test-coefficient"
			};
			getWallet.mockReturnValue(mockWallet);

			// Act
			const wallet = client.getWallet();

			// Assert
			expect(getWallet).toHaveBeenCalled();
			expect(wallet).toEqual(mockWallet);
		});

		it('should return undefined for read-only client', () => {
			// Arrange
			getWallet.mockReturnValue(undefined);

			// Act
			const wallet = client.getWallet();

			// Assert
			expect(getWallet).toHaveBeenCalled();
			expect(wallet).toBeUndefined();
		});
	});
});
