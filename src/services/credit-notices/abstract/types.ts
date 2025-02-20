import { Tags } from "src/core";
import { GetAllMessagesByRecipientParams } from "src/services/messages";

/**
 * Parameters for retrieving all credit notices
 */
export interface GetAllCreditNoticesParams extends Omit<GetAllMessagesByRecipientParams, "owner" | "tags">{
    /** Optional additional tags to filter by */
    additionalTags?: Tags;
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
    /** Timestamp when the transaction was ingested */
    ingestedAt: number;
}
