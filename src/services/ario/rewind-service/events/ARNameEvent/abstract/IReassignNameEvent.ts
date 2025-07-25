import { CurrencyAmount } from "../../../../../../models/currency";
import { ReassignNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IReassignNameEvent extends IARNameEvent {
	getNoticeData(): Promise<ReassignNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getReassignedProcessId(): Promise<string>;
}
