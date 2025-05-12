import { CreditNoticeService } from "src/services/credit-notices";
import { MessagesService } from "src/services/messages";
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME, QUANTITY_TAG_NAME } from "src/services/credit-notices/constants";
import { GetCreditNoticesError } from "src/services/credit-notices/CreditNoticeServiceError";
import { Logger, LogLevel } from "src/utils";
import { ArweaveTransaction } from "src/core/arweave/abstract/types";

// Mock MessagesService
jest.mock("src/services/messages/message-service/MessagesService");

describe("CreditNoticeService", () => {
	let service: CreditNoticeService;
	let mockGetAllMessagesReceivedBy: jest.Mock;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.NONE);

		// Setup mock implementation
		mockGetAllMessagesReceivedBy = jest.fn().mockResolvedValue([]);
		const mockMessagesService = {
			getAllMessagesReceivedBy: mockGetAllMessagesReceivedBy
		};

		// Configure mock
		(MessagesService.autoConfiguration as jest.Mock).mockReturnValue(mockMessagesService);

		// Create service instance
		service = CreditNoticeService.autoConfiguration();
	});

	describe("getAllCreditNoticesReceivedById", () => {
		const mockTransaction: Partial<ArweaveTransaction> = {
			id: "test-tx-id",
			tags: [
				{ name: "Quantity", value: "100" },
				{ name: "Sender", value: "test-sender" },
				{ name: "From-Process", value: "test-process" }
			],
			data: { size: "0", type: "text" },
			block: {
				id: "test-block-id",
				timestamp: 0,
				height: 0,
				previous: "test-previous-block"
			},
			recipient: "test-recipient",
			ingested_at: Date.now()
		};

		beforeEach(() => {
			mockGetAllMessagesReceivedBy.mockResolvedValue([mockTransaction as ArweaveTransaction]);
		});

		it("should include credit notice action tag in query", async () => {
			const testParams = {
				recipientId: "test-recipient"
			};

			await service.getAllCreditNoticesReceivedById(testParams);

			expect(mockGetAllMessagesReceivedBy).toHaveBeenCalledWith({
				recipientId: "test-recipient",
				tags: [CREDIT_NOTICE_ACTION_TAG]
			});
		});

		it("should combine credit notice tag with additional tags", async () => {
			const additionalTag = { name: "Test", value: "Value" };
			const testParams = {
				recipientId: "test-recipient",
				additionalTags: [additionalTag]
			};

			await service.getAllCreditNoticesReceivedById(testParams);

			expect(mockGetAllMessagesReceivedBy).toHaveBeenCalledWith({
				recipientId: "test-recipient",
				additionalTags: [additionalTag],
				tags: [CREDIT_NOTICE_ACTION_TAG, additionalTag]
			});
		});

		it("should wrap errors in GetCreditNoticesError", async () => {
			const testError = new Error("Test error");
			mockGetAllMessagesReceivedBy.mockRejectedValue(testError);

			await expect(service.getAllCreditNoticesReceivedById({
				recipientId: "test-recipient"
			})).rejects.toThrow(GetCreditNoticesError);
		});
	});

	describe("getCreditNoticesFromProcess", () => {
		it("should include From-Process tag in query", async () => {
			const testRecipientId = "test-recipient";
			const testTokenId = "test-token";

			await service.getCreditNoticesFromProcess(testRecipientId, testTokenId);

			expect(mockGetAllMessagesReceivedBy).toHaveBeenCalledWith({
				recipientId: testRecipientId,
				additionalTags: [{ name: FROM_PROCESS_TAG_NAME, value: testTokenId }],
				tags: [CREDIT_NOTICE_ACTION_TAG, { name: FROM_PROCESS_TAG_NAME, value: testTokenId }]
			});
		});

		it("should include Quantity tag when amountSent is provided", async () => {
			const testRecipientId = "test-recipient";
			const testTokenId = "test-token";
			const testAmount = "100";

			await service.getCreditNoticesFromProcess(testRecipientId, testTokenId, testAmount);

			expect(mockGetAllMessagesReceivedBy).toHaveBeenCalledWith({
				recipientId: testRecipientId,
				additionalTags: [
					{ name: FROM_PROCESS_TAG_NAME, value: testTokenId },
					{ name: QUANTITY_TAG_NAME, value: testAmount }
				],
				tags: [
					CREDIT_NOTICE_ACTION_TAG,
					{ name: FROM_PROCESS_TAG_NAME, value: testTokenId },
					{ name: QUANTITY_TAG_NAME, value: testAmount }
				]
			});
		});

		it("should wrap errors in GetCreditNoticesError", async () => {
			const testError = new Error("Test error");
			mockGetAllMessagesReceivedBy.mockRejectedValue(testError);

			await expect(service.getCreditNoticesFromProcess(
				"test-recipient",
				"test-token"
			)).rejects.toThrow(GetCreditNoticesError);
		});
	});
});
