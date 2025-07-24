import { CurrencyAmount } from "../../../../../models/currency";
import { ReassignNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IReassignNameEvent extends IARNSNameEvent {
	getNotice(): Promise<ReassignNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
