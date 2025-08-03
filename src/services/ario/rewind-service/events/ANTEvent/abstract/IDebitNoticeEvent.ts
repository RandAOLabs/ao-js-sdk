
import { IANTEvent } from "./IANTEvent";

export interface IDebitNoticeEvent extends IANTEvent {
	getRecipient(): string;
	getQuantity(): string;
	getSender(): string;
}
