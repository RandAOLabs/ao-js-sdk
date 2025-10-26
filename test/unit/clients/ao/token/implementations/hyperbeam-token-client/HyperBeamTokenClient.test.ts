import { HyperBeamTokenClient } from "src/clients/ao/token/implementations/hyperbeam-token-client/HyperBeamTokenClient";
import { AOProcessClientConfig } from "src/clients/common";
import { HyperbeamClient } from "src/core/ao/hyperbeam/hyperbeam-client/HyperbeamClient";
import { AOClientBuilder } from "src/core/ao/ao-client/AOClientBuilder";
import { getWalletSafely } from "src/utils/wallet/wallet";
import { Logger, LogLevel } from "src/utils";
import { Tags } from "src/core";
import { DryRunResult, MessageResult } from "src/core/ao/abstract";
import { TokenInfo } from "src/clients/ao/token/abstract";
import { TRANSFER_SUCCESS_MESSAGE } from "src/clients/ao/token/constants";

// Mock dependencies
jest.mock("src/core/ao/hyperbeam/hyperbeam-client/HyperbeamClient");
jest.mock("src/core/ao/ao-client/AOClientBuilder");
jest.mock("src/utils/wallet/wallet");

describe("HyperBeamTokenClient", () => {
	let client: HyperBeamTokenClient;
	let mockHyperbeamClient: jest.Mocked<any>;
	let mockAOClient: jest.Mocked<any>;
	let mockAOClientBuilder: jest.Mocked<AOClientBuilder>;

	const mockConfig: AOProcessClientConfig = {
		processId: "test-process-id"
	};

	beforeAll(() => {
		Logger.setLogLevel(LogLevel.NONE);
	});

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Mock HyperbeamClient
		mockHyperbeamClient = {
			compute: jest.fn()
		};
		(HyperbeamClient.autoConfiguration as jest.Mock).mockReturnValue(mockHyperbeamClient);

		// Mock AO Client
		mockAOClient = {
			message: jest.fn(),
			result: jest.fn(),
			dryrun: jest.fn()
		};

		// Mock AOClientBuilder
		mockAOClientBuilder = {
			withWalletAutoConfiguration: jest.fn().mockReturnThis(),
			withRetriesEnabled: jest.fn().mockReturnThis(),
			withAOConfig: jest.fn().mockReturnThis(),
			build: jest.fn().mockReturnValue(mockAOClient)
		} as any;
		(AOClientBuilder as jest.Mock).mockImplementation(() => mockAOClientBuilder);

		// Mock getWalletSafely
		(getWalletSafely as jest.Mock).mockReturnValue(undefined);

		// Create client instance
		client = new HyperBeamTokenClient(mockConfig);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("constructor", () => {
		it("should initialize with correct configuration and use withWalletAutoConfiguration", () => {
			expect(HyperbeamClient.autoConfiguration).toHaveBeenCalled();
			expect(AOClientBuilder).toHaveBeenCalled();
			expect(mockAOClientBuilder.withWalletAutoConfiguration).toHaveBeenCalled();
			expect(mockAOClientBuilder.withRetriesEnabled).toHaveBeenCalledWith(false);
			expect(mockAOClientBuilder.withAOConfig).toHaveBeenCalledWith(undefined);
			expect(mockAOClientBuilder.build).toHaveBeenCalled();
		});

		it("should merge provided config with defaults", () => {
			const configWithOptions: AOProcessClientConfig & any = {
				processId: "test-process-id",
				retriesEnabled: true,
				wallet: "test-wallet",
				aoConfig: "test-config"
			};

			new HyperBeamTokenClient(configWithOptions);

			expect(mockAOClientBuilder.withRetriesEnabled).toHaveBeenCalledWith(true);
			expect(mockAOClientBuilder.withAOConfig).toHaveBeenCalledWith("test-config");
		});
	});

	describe("balance()", () => {
		it("should fetch balance successfully", async () => {
			// Arrange
			const entityId = "test-entity-id";
			const expectedBalance = "1000000000000";
			mockHyperbeamClient.compute.mockResolvedValue(expectedBalance);

			// Act
			const result = await client.balance(entityId);

			// Assert
			expect(mockHyperbeamClient.compute).toHaveBeenCalledWith(
				mockConfig.processId,
				`balances/${entityId}`
			);
			expect(result).toBe(expectedBalance);
		});

		it("should handle balance fetch errors", async () => {
			// Arrange
			const entityId = "test-entity-id";
			const error = new Error("Network error");
			mockHyperbeamClient.compute.mockRejectedValue(error);

			// Act & Assert
			await expect(client.balance(entityId)).rejects.toThrow("Network error");
		});
	});

	describe("transfer()", () => {
		it("should transfer tokens successfully", async () => {
			// Arrange
			const recipient = "test-recipient";
			const quantity = "500000000000";
			const messageId = "test-message-id";
			const mockResult: MessageResult = {
				Output: undefined,
				Messages: [{
					Data: TRANSFER_SUCCESS_MESSAGE,
					Tags: []
				}],
				Spawns: []
			};

			mockAOClient.message.mockResolvedValue(messageId);
			mockAOClient.result.mockResolvedValue(mockResult);

			// Act
			const result = await client.transfer(recipient, quantity);

			// Assert
			expect(mockAOClient.message).toHaveBeenCalledWith(
				mockConfig.processId,
				'',
				expect.arrayContaining([
					{ name: "Action", value: "Transfer" },
					{ name: "Recipient", value: recipient },
					{ name: "Quantity", value: quantity }
				])
			);
			expect(mockAOClient.result).toHaveBeenCalledWith({
				process: mockConfig.processId,
				message: messageId
			});
			expect(result).toBe(true);
		});

		it("should handle insufficient balance error", async () => {
			// Arrange
			const recipient = "test-recipient";
			const quantity = "500000000000";
			const messageId = "test-message-id";
			const mockResult: MessageResult = {
				Output: undefined,
				Messages: [{
					Data: "Transfer failed",
					Tags: [{ name: "Error", value: "Insufficient Balance!" }]
				}],
				Spawns: []
			};

			mockAOClient.message.mockResolvedValue(messageId);
			mockAOClient.result.mockResolvedValue(mockResult);

			// Act & Assert
			await expect(client.transfer(recipient, quantity))
				.rejects.toThrow("Insufficient Balance for transfer");
		});
	});

	describe("getInfo()", () => {
		it("should get token info successfully", async () => {
			// Arrange
			const mockDryRunResult: DryRunResult = {
				Output: undefined,
				Messages: [{
					Data: "",
					Tags: [
						{ name: "Data-Protocol", value: "ao" },
						{ name: "Variant", value: "ao.TN.1" },
						{ name: "Type", value: "Token" },
						{ name: "Reference", value: "1234" },
						{ name: "Action", value: "Info" },
						{ name: "Logo", value: "test-logo" },
						{ name: "TotalSupply", value: "1000000000000" },
						{ name: "Name", value: "Test Token" },
						{ name: "Ticker", value: "TEST" },
						{ name: "Denomination", value: "12" },
						{ name: "TransferRestricted", value: "false" }
					]
				}],
				Spawns: []
			};

			const expectedTokenInfo: TokenInfo = {
				dataProtocol: "ao",
				variant: "ao.TN.1",
				type: "Token",
				reference: "1234",
				action: "Info",
				logo: "test-logo",
				totalSupply: "1000000000000",
				name: "Test Token",
				ticker: "TEST",
				denomination: "12",
				transferRestricted: "false"
			};

			mockAOClient.dryrun.mockResolvedValue(mockDryRunResult);

			// Act
			const result = await client.getInfo();

			// Assert
			expect(mockAOClient.dryrun).toHaveBeenCalledWith({
				process: mockConfig.processId,
				data: '',
				tags: [{ name: "Action", value: "Info" }]
			});
			expect(result).toEqual(expectedTokenInfo);
		});

		it("should throw error when no messages found", async () => {
			// Arrange
			const mockDryRunResult: DryRunResult = {
				Output: undefined,
				Messages: [],
				Spawns: []
			};

			mockAOClient.dryrun.mockResolvedValue(mockDryRunResult);

			// Act & Assert
			await expect(client.getInfo()).rejects.toThrow("No messages found in result");
		});
	});

	describe("mint()", () => {
		it("should mint tokens successfully", async () => {
			// Arrange
			const quantity = "1000000000000";
			const messageId = "test-message-id";
			const mockResult: MessageResult = {
				Output: undefined,
				Messages: [{
					Data: "",
					Tags: [{ name: "Action", value: "Mint-Success" }]
				}],
				Spawns: []
			};

			mockAOClient.message.mockResolvedValue(messageId);
			mockAOClient.result.mockResolvedValue(mockResult);

			// Act
			const result = await client.mint(quantity);

			// Assert
			expect(mockAOClient.message).toHaveBeenCalledWith(
				mockConfig.processId,
				'',
				expect.arrayContaining([
					{ name: "Action", value: "Mint" },
					{ name: "Quantity", value: quantity }
				])
			);
			expect(mockAOClient.result).toHaveBeenCalledWith({
				process: mockConfig.processId,
				message: messageId
			});
			expect(result).toBe(true);
		});

		it("should return false on mint error", async () => {
			// Arrange
			const quantity = "1000000000000";
			const messageId = "test-message-id";
			const mockResult: MessageResult = {
				Output: undefined,
				Messages: [{
					Data: "",
					Tags: [{ name: "Action", value: "Mint-Error" }]
				}],
				Spawns: []
			};

			mockAOClient.message.mockResolvedValue(messageId);
			mockAOClient.result.mockResolvedValue(mockResult);

			// Act
			const result = await client.mint(quantity);

			// Assert
			expect(result).toBe(false);
		});
	});
});
