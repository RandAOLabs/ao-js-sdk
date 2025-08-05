import { Tags } from "../../../core";
import { GetAllMessagesByRecipientParams, GetLatestMessagesParams } from "../../messages";

/**
 * Parameters for retrieving all credit notices
 */
export interface GetAllCreditNoticesParams extends Omit<GetAllMessagesByRecipientParams, "owner" | "tags"> {
	/** Optional additional tags to filter by */
	additionalTags?: Tags;
}

/**
 * Parameters for retrieving all credit notices
 */
export interface GetLatestCreditNoticesParams extends Omit<GetLatestMessagesParams, "owner" | "tags"> {
	/** Optional additional tags to filter by */
	additionalTags?: Tags;
}

/**
 * Parameters for retrieving credit notices from a process for a specific time period
 */
export interface GetCreditNoticesForPeriodParams {
	/** The token process ID to get credit notices from */
	tokenProcessId: string;
	/** Start date for the period */
	fromDate: Date;
	/** End date for the period */
	toDate: Date;
}

/**
 * Represents a credit notice with essential fields extracted from an Arweave transaction
 */
export interface CreditNotice {
	/** Unique identifier of the credit notice */
	id: string;
	/** Address of the recipient */
	recipient: string;
	/** Quantity of credits being transferred */
	quantity: string;
	/** Address of the sender */
	sender: string;
	/** Process ID that sent the credit notice */
	fromProcess: string;
	/** Timestamp of the block this transaction was included in */
	blockTimeStamp: number | undefined;
}
