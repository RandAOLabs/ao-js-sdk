import { Logger } from "../../utils/logger/logger";
import { ICreditNoticeService } from "./abstract/ICreditNoticeService";
import { GetCreditNoticesError } from "./CreditNoticeServiceError";
import { GetAllCreditNoticesParams, GetCreditNoticesForPeriodParams } from "./abstract/types";
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME, QUANTITY_TAG_NAME } from "./constants";
import { GetAllMessagesByRecipientParams, IAutoconfiguration, IMessagesService, MessagesService } from "../../index";
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


	public async getCreditNoticesBetween(fromEntityId: string, toEntityId: string): Promise<CreditNotice[]> {
		return this.getAllCreditNoticesReceivedById({
				recipientId: toEntityId,
				additionalTags: [{ name: FROM_PROCESS_TAG_NAME, value: fromEntityId }]
			});
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

	/**
	 * Get all credit notices from a specific process within a date range
	 * @param params Parameters containing the token process ID and date range
	 * @returns Promise resolving to array of credit notices within the specified period
	 */
	public async getAllCreditNoticesFromProcessForPeriod(params: GetCreditNoticesForPeriodParams): Promise<CreditNotice[]> {
		try {
			// Create tags array with the From-Process tag
			const tags: Tags = [
				{ name: FROM_PROCESS_TAG_NAME, value: params.tokenProcessId },
				CREDIT_NOTICE_ACTION_TAG
			];

			// Get all credit notices from the process (using wildcard "*" to get all recipients)
			const transactions = await this.messagesService.getAllMessages({
				tags
			});

			const allNotices = CreditNoticeConverter.convertMany(transactions)

			// Filter notices by date range
			return allNotices.filter(notice => {
				// Skip notices without timestamp
				if (!notice.blockTimeStamp) return false;
				
				// Convert timestamp to Date (blockTimeStamp is in milliseconds)
				const noticeDate = new Date(notice.blockTimeStamp*1000);
				
				// Check if the notice is within the date range
				return noticeDate >= params.fromDate && noticeDate <= params.toDate;
			});
		} catch (error: any) {
			Logger.error(`Error retrieving credit notices for period: ${error.message}`);
			throw new GetCreditNoticesError(error);
		}
	}
}
