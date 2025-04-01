import { GetAllCreditNoticesParams } from "./types";
import { CreditNotice } from "../types";

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
}
