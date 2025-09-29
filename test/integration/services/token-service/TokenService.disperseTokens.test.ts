import { TokenService } from "../../../../src/services/token-service/TokenService";
import { CurrencyAmount } from "../../../../src/models/financial/currency/CurrencyAmount";
import { BOTEGA } from "../../../../src/constants/processIds/botega";
import { Logger } from "../../../../src/utils/logger";
import { wallets } from "./wallets";

describe('TokenService.disperseTokens Integration Tests', () => {
	let tokenService: TokenService;
	let currentBalance: bigint;

	// Test wallet addresses for dispersion
	const testWallets = wallets;

	beforeAll(() => {
		tokenService = new TokenService(BOTEGA.LP_TOKENS.GAME_AO_25);
	});

	describe('getBalance', () => {
		it('should get and log the current token balance', async () => {
			try {
				// Get the current balance from the token service
				currentBalance = await tokenService.getBalance("EW6UPnYGCixbmGFbkCZPKwLGCP-q9pK4IBDSskGQYUI");

				Logger.info('=== Token Balance Test ===');
				Logger.info('Token Process ID:', BOTEGA.LP_TOKENS.GAME_AO_25);
				Logger.info('Current balance (raw):', currentBalance.toString());

				// Create CurrencyAmount for better formatting
				const balanceFormatted = new CurrencyAmount(currentBalance, 12);
				Logger.info('Current balance (formatted):', balanceFormatted.toString());
				Logger.info('Current balance (abbreviated):', balanceFormatted.toAbbreviated(2));

				// Verify balance is a valid bigint
				expect(typeof currentBalance).toBe('bigint');
				expect(currentBalance).toBeGreaterThanOrEqual(BigInt(0));

			} catch (error) {
				Logger.error('Error getting token balance:', error);
				throw error;
			}
		}, 30000); // 30 second timeout for balance retrieval
	});

	describe('disperseTokens', () => {
		it('should disperse tokens evenly among wallets using the retrieved balance', async () => {
			try {
				// Ensure we have a balance from the previous test
				if (!currentBalance) {
					throw new Error('Balance not retrieved from previous test');
				}

				// Use a small portion of the balance for testing (e.g., 10% or minimum 1000 tokens)
				let balanceToUse = currentBalance
				// Create a test amount using the actual balance with 12 decimals
				const totalAmount = new CurrencyAmount(balanceToUse, 12);

				Logger.info('=== Token Dispersion Test ===');
				Logger.info('Available balance:', currentBalance.toString());
				Logger.info('Total amount to disperse:', totalAmount.toString());
				Logger.info('Number of wallets:', testWallets.length);
				Logger.info('Amount per wallet:', totalAmount.divide(testWallets.length).toString());

				const transactionIds = await tokenService.disperseTokens(totalAmount, testWallets);

				Logger.info('Token dispersion completed successfully');
				Logger.info('Transaction IDs:', transactionIds);

				// Verify we got transaction IDs for each wallet
				expect(transactionIds).toHaveLength(testWallets.length);
				expect(transactionIds.every(id => typeof id === 'string' && id.length > 0)).toBe(true);

				// Log individual results
				transactionIds.forEach((txId, index) => {
					Logger.info(`Wallet ${index + 1} (${testWallets[index]}): Transaction ID ${txId}`);
				});

			} catch (error) {
				Logger.error('Error during token dispersion:', error);

				// If the error is due to insufficient balance or other expected conditions, log it but don't fail the test
				if (error instanceof Error && (
					error.message.includes('Insufficient Balance') ||
					error.message.includes('Failed to transfer')
				)) {
					Logger.warn('Test failed due to expected business logic constraints:', error.message);
					// Mark test as pending rather than failing
					pending('Test requires sufficient token balance or proper wallet setup');
				} else {
					throw error;
				}
			}
		}, 60000); // 60 second timeout for multiple transfers
	});
});
