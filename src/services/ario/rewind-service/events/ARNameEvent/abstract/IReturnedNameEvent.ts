import { ReturnedNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IReturnedNameEvent extends IARNameEvent {
	getNoticeData(): Promise<ReturnedNameNoticeTransactionData>;
	getInitiator(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getName(): Promise<string>;
}
