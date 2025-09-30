import { WalletUtils } from "src/core/common/wallet-utils/WalletUtils";
import { Logger, LogLevel } from "src/utils";

describe('WalletUtils', () => {
	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.NONE)
	});

	describe('convertArweaveAddressToBytes32', () => {
		it('should convert a valid Arweave address to bytes32 format', () => {
			// Arrange
			const arweaveAddress = '-pSkpFxM8EF-jmYgeIRn1JZc-ZJW4lB6yZEKBgMQVak';
			
			// Act
			const result = WalletUtils.convertArweaveAddressToBytes32(arweaveAddress);
			
			// Assert
			expect(result).toBe("0xfa94a4a45c4cf0417e8e6620788467d4965cf99256e2507ac9910a06031055a9"); // '0x' + 64 hex characters
		});

	});

	describe('convertBytes32ToArweaveAddress', () => {
		it('should convert a valid bytes32 hex to Arweave address', () => {
			// Arrange
			const bytes32Hex = '0xfa94a4a45c4cf0417e8e6620788467d4965cf99256e2507ac9910a06031055a9';
			
			// Act
			const result = WalletUtils.convertBytes32ToArweaveAddress(bytes32Hex);
			Logger.info(result)
			// Assert
			expect(result).toBe('-pSkpFxM8EF-jmYgeIRn1JZc-ZJW4lB6yZEKBgMQVak');
			expect(result.length).toBeGreaterThan(0);
		});
	});

});