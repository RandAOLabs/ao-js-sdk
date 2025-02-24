import { Logger } from "src/utils/logger/logger";
import { ICreditNoticeService } from "src/services/credit-notices/abstract/ICreditNoticeService";
import { GetCreditNoticesError } from "src/services/credit-notices/CreditNoticeServiceError";
import { GetAllCreditNoticesParams } from "src/services/credit-notices/abstract/types";
import { MessagesService } from "src/services/messages/MessagesService";
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME, QUANTITY_TAG_NAME } from "src/services/credit-notices/constants";
import { GetAllMessagesByRecipientParams } from "src/index";
import { CreditNotice } from "src/services/credit-notices/abstract/types";
import CreditNoticeConverter from "src/services/credit-notices/CreditNoticeConverter";
import { Tags } from "src/core";

/**
 * @category On-chain-data
 */
export class CreditNoticeService implements ICreditNoticeService {
    private readonly messagesService: MessagesService;

    constructor() {
        this.messagesService = new MessagesService();
    }

    public async getAllCreditNoticesReceivedById(params: GetAllCreditNoticesParams): Promise<CreditNotice[]> {
        try {
            // Add the Credit Notice action tag
            const tags = [
                CREDIT_NOTICE_ACTION_TAG,
                ...(params.additionalTags || [])
            ];

            const messageQueryParams: GetAllMessagesByRecipientParams = {
                ...params,
                tags
            }

            const transactions = await this.messagesService.getAllMessagesReceivedBy(messageQueryParams);
            return transactions.map(tx => CreditNoticeConverter.convert(tx));
        } catch (error: any) {
            Logger.error(`Error retrieving credit notices: ${error.message}`);
            throw new GetCreditNoticesError(error);
        }
    }

    public async getCreditNoticesFromProcess(recipientId: string, tokenId: string, amountSent?: string): Promise<CreditNotice[]> {
        try {
            // Create tags array with required tags
            const tags: Tags = [
                { name: FROM_PROCESS_TAG_NAME, value: tokenId }
            ];

            // Add optional Quantity tag if amountSent is provided
            if (amountSent) {
                tags.push({ name: QUANTITY_TAG_NAME, value: amountSent });
            }

            // Use existing method with our custom tags
            return this.getAllCreditNoticesReceivedById({
                recipientId,
                additionalTags: tags
            });
        } catch (error: any) {
            Logger.error(`Error retrieving credit notices from process: ${error.message}`);
            throw new GetCreditNoticesError(error);
        }
    }
}
