import { ReturnedNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IReturnedNameEvent extends IARNSNameEvent {
	getNotice(): Promise<ReturnedNameNoticeTransactionData>;
	getInitiator(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getName(): Promise<string>;
}
