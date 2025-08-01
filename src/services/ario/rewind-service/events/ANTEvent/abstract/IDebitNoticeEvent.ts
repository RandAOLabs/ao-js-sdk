import { DebitNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IDebitNoticeEvent extends IANTEvent, ITransactionDataEvent<DebitNoticeTransactionData> {
	getRecipient(): string;
	getQuantity(): string;
	getSender(): string;
}
