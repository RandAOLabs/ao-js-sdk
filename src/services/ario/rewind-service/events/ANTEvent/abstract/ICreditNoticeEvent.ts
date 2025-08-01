
import { IANTEvent } from "./IANTEvent";

export interface ICreditNoticeEvent extends IANTEvent {
	getRecipient(): string;
	getQuantity(): string;
	getSender(): string;
}
