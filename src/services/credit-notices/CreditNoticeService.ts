import { Logger } from "../../utils/logger/logger";
import { ICreditNoticeService } from "./abstract/ICreditNoticeService";
import { GetCreditNoticesError } from "./CreditNoticeServiceError";
import { GetAllCreditNoticesParams } from "./abstract/types";
import { MessagesService } from "../messages/MessagesService";
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME, QUANTITY_TAG_NAME } from "./constants";
import { GetAllMessagesByRecipientParams, IAutoconfiguration, IMessagesService } from "../../index";
import { staticImplements } from "../../utils/decorators";
import { CreditNotice } from "./abstract/types";
import CreditNoticeConverter from "./CreditNoticeConverter";
import { Tags } from "../../core";

/**
 * @category On-chain-data
 */
@staticImplements<IAutoconfiguration>()
export class CreditNoticeService implements ICreditNoticeService {

	private constructor(
		private readonly messagesService: IMessagesService,
	) { }

	public static autoConfiguration(): CreditNoticeService {
		return new CreditNoticeService(
			MessagesService.autoConfiguration()
		)
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
