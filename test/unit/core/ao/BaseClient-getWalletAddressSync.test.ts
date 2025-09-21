import { BaseClient } from 'src/core/ao/BaseClient';
import { BaseClientConfigBuilder } from 'src/core/ao/configuration/builder';
import { AOReadOnlyClientError } from 'src/core/ao/ao-client';

// Create mock functions for IAOClient implementation
const message = jest.fn();
const results = jest.fn();
const result = jest.fn();
const dryrun = jest.fn();
const getCallingWalletAddress = jest.fn();
const getWallet = jest.fn();
const isReadOnly = jest.fn();
const getActiveConfig = jest.fn();

// Mock EnvironmentSha256Hasher
const mockHasher = {
	supportsSynchronousHashing: jest.fn(),
	sha256BytesSync: jest.fn()
};

jest.mock('src/utils/crypto', () => ({
	EnvironmentSha256Hasher: {
		autoConfiguration: jest.fn(() => mockHasher)
	},
	ByteUtils: {
		base64UrlToBytes: jest.fn(),
		bytesToBase64Url: jest.fn()
	}
}));

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

describe("BaseClient - getWalletAddressSync()", () => {
	let client: BaseClient;
	const { EnvironmentSha256Hasher, ByteUtils } = require('src/utils/crypto');

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Set up default mock return values
		isReadOnly.mockReturnValue(false);
		getWallet.mockReturnValue({
			kty: "RSA",
			n: "test-modulus-base64url",
			e: "AQAB",
			d: "test-private-exponent",
			p: "test-prime-1",
			q: "test-prime-2",
			dp: "test-exponent-1",
			dq: "test-exponent-2",
			qi: "test-coefficient"
		});
		getActiveConfig.mockReturnValue({});

		// Set up crypto mocks
		mockHasher.supportsSynchronousHashing.mockReturnValue(true);
		mockHasher.sha256BytesSync.mockReturnValue(new Uint8Array([1, 2, 3, 4, 5]));
		ByteUtils.base64UrlToBytes.mockReturnValue(new Uint8Array([10, 20, 30]));
		ByteUtils.bytesToBase64Url.mockReturnValue('mock-wallet-address');

		const config = new BaseClientConfigBuilder()
			.withProcessId("test-process-id")
			.withWallet({
				kty: "RSA",
				n: "test-modulus-base64url",
				e: "AQAB",
				d: "test-private-exponent",
				p: "test-prime-1",
				q: "test-prime-2",
				dp: "test-exponent-1",
				dq: "test-exponent-2",
				qi: "test-coefficient"
			})
			.build();

		client = new BaseClient(config);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Happy Path', () => {
		it('should derive wallet address synchronously when all conditions are met', () => {
			// Act
			const address = client.getWalletAddressSync();

			// Assert
			expect(EnvironmentSha256Hasher.autoConfiguration).toHaveBeenCalled();
			expect(mockHasher.supportsSynchronousHashing).toHaveBeenCalled();
			expect(getWallet).toHaveBeenCalled();
			expect(ByteUtils.base64UrlToBytes).toHaveBeenCalledWith('test-modulus-base64url');
			expect(mockHasher.sha256BytesSync).toHaveBeenCalledWith(new Uint8Array([10, 20, 30]));
			expect(ByteUtils.bytesToBase64Url).toHaveBeenCalledWith(new Uint8Array([1, 2, 3, 4, 5]));
			expect(address).toBe('mock-wallet-address');
		});
	});

	describe('Error Cases', () => {
		it('should throw AOReadOnlyClientError when client is read-only', () => {
			// Arrange
			isReadOnly.mockReturnValue(true);

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(AOReadOnlyClientError);
			expect(mockHasher.supportsSynchronousHashing).not.toHaveBeenCalled();
		});

		it('should throw error when wallet is not available', () => {
			// Arrange
			getWallet.mockReturnValue(null);

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow('No wallet available or invalid JWK format');
			expect(mockHasher.supportsSynchronousHashing).not.toHaveBeenCalled();
		});

		it('should throw error when wallet has no modulus (n)', () => {
			// Arrange
			getWallet.mockReturnValue({
				kty: "RSA",
				e: "AQAB",
				d: "test-private-exponent"
				// Missing 'n' property
			});

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow('No wallet available or invalid JWK format');
			expect(mockHasher.supportsSynchronousHashing).not.toHaveBeenCalled();
		});

		it('should throw error when synchronous hashing is not supported', () => {
			// Arrange
			mockHasher.supportsSynchronousHashing.mockReturnValue(false);

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(
				'Synchronous hashing is not supported in the current environment. Use getCallingWalletAddress() instead.'
			);
			expect(ByteUtils.base64UrlToBytes).not.toHaveBeenCalled();
		});

		it('should throw error when ByteUtils.base64UrlToBytes fails', () => {
			// Arrange
			ByteUtils.base64UrlToBytes.mockImplementation(() => {
				throw new Error('Invalid base64url format');
			});

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(
				'Failed to derive wallet address synchronously: Invalid base64url format'
			);
		});

		it('should throw error when hasher.sha256BytesSync fails', () => {
			// Arrange
			mockHasher.sha256BytesSync.mockImplementation(() => {
				throw new Error('Hashing failed');
			});

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(
				'Failed to derive wallet address synchronously: Hashing failed'
			);
		});

		it('should throw error when ByteUtils.bytesToBase64Url fails', () => {
			// Arrange
			ByteUtils.bytesToBase64Url.mockImplementation(() => {
				throw new Error('Base64url encoding failed');
			});

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(
				'Failed to derive wallet address synchronously: Base64url encoding failed'
			);
		});

		it('should handle unknown error types', () => {
			// Arrange
			ByteUtils.base64UrlToBytes.mockImplementation(() => {
				throw 'String error'; // Non-Error object
			});

			// Act & Assert
			expect(() => client.getWalletAddressSync()).toThrow(
				'Failed to derive wallet address synchronously: Unknown error'
			);
		});
	});

	describe('Integration with Components', () => {
		it('should use correct sequence of operations', () => {
			// Act
			client.getWalletAddressSync();

			// Assert the call order
			const callOrder = [
				EnvironmentSha256Hasher.autoConfiguration,
				mockHasher.supportsSynchronousHashing,
				getWallet,
				ByteUtils.base64UrlToBytes,
				mockHasher.sha256BytesSync,
				ByteUtils.bytesToBase64Url
			];

			// Check that each function was called
			callOrder.forEach(fn => {
				expect(fn).toHaveBeenCalled();
			});
		});

		it('should pass correct data through the pipeline', () => {
			// Arrange
			const testModulus = 'test-modulus-12345';
			const testBytes = new Uint8Array([100, 200, 50]);
			const testHash = new Uint8Array([50, 100, 150, 200, 250]);
			const expectedAddress = 'final-wallet-address';

			getWallet.mockReturnValue({
				kty: "RSA",
				n: testModulus,
				e: "AQAB"
			});
			ByteUtils.base64UrlToBytes.mockReturnValue(testBytes);
			mockHasher.sha256BytesSync.mockReturnValue(testHash);
			ByteUtils.bytesToBase64Url.mockReturnValue(expectedAddress);

			// Act
			const result = client.getWalletAddressSync();

			// Assert
			expect(ByteUtils.base64UrlToBytes).toHaveBeenCalledWith(testModulus);
			expect(mockHasher.sha256BytesSync).toHaveBeenCalledWith(testBytes);
			expect(ByteUtils.bytesToBase64Url).toHaveBeenCalledWith(testHash);
			expect(result).toBe(expectedAddress);
		});
	});
});
