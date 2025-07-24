import { CurrencyAmount } from "../../../../../../models/currency";
import { ReassignNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IReassignNameEvent extends IARNameEvent {
	getNotice(): Promise<ReassignNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
