import { GetAllCreditNoticesParams, GetCreditNoticesForPeriodParams } from "./types";
import { CreditNotice } from "./types";

/**
 * Interface for credit notice service operations
 */
export interface ICreditNoticeService {
    /**
     * Get all credit notices received by a specific ID
     * @param params Parameters for retrieving credit notices
     * @returns Promise resolving to array of credit notices
     */
    getAllCreditNoticesReceivedById(params: GetAllCreditNoticesParams): Promise<CreditNotice[]>;

    /**
     * Get credit notices received by a recipient from a specific process with optional amount
     * @param recipientId The ID of the recipient
     * @param tokenId The token ID to use as From-Process tag value
     * @param amountSent Optional amount to filter by as Quantity tag
     * @returns Promise resolving to array of credit notices
     */
    getCreditNoticesFromProcess(recipientId: string, tokenId: string, amountSent?: string): Promise<CreditNotice[]>;
    
    /**
     * Get all credit notices from a specific process within a date range
     * @param params Parameters containing the token process ID and date range
     * @returns Promise resolving to array of credit notices within the specified period
     */
    getAllCreditNoticesFromProcessForPeriod(params: GetCreditNoticesForPeriodParams): Promise<CreditNotice[]>;


	/**
     * Get credit notices from and entity yo an entity
     * @param fromEntityId entity that sent the credit notice
     * @param toEntityId entity that received the credit notice
     * @returns Promise resolving to array of credit notices
     */
    getCreditNoticesBetween(fromEntityId: string, toEntityId: string): Promise<CreditNotice[]>;
}
