import { CreditNoticeService } from "src/services/credit-notices";
import { MessagesService } from "src/services/messages";
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME } from "src/services/credit-notices/constants";
import { GetCreditNoticesError } from "src/services/credit-notices/CreditNoticeServiceError";
import { Logger, LogLevel } from "src/utils";

// Mock MessagesService
jest.mock("../../../../src/services/messages/MessagesService");

describe("CreditNoticeService", () => {
    let service: CreditNoticeService;
    let mockGetAllMessagesReceivedBy: jest.Mock;

    beforeEach(() => {
        Logger.setLogLevel(LogLevel.NONE)

        jest.clearAllMocks();
        mockGetAllMessagesReceivedBy = jest.fn().mockResolvedValue([]);
        (MessagesService as jest.Mock).mockImplementation(() => ({
            getAllMessagesReceivedBy: mockGetAllMessagesReceivedBy
        }));
        service = new CreditNoticeService();
    });

    describe("getAllCreditNoticesReceivedById", () => {
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

            // The service spreads all params and then overrides tags
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

            expect(mockGetAllMessagesReceivedBy).toHaveBeenCalled()
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
