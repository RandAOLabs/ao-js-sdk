import { ReturnedNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { ITransactionDataEvent } from "../../abstract";
import { IARNameEvent } from "./IARNameEvent";

export interface IReturnedNameEvent extends IARNameEvent, ITransactionDataEvent<ReturnedNameNoticeTransactionData> {
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getName(): Promise<string>;
}
