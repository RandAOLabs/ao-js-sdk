import { CurrencyAmount } from "../../../../../models/currency";
import { RecordNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/RecordNoticeTransactionData";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IRecordEvent extends IARNSNameEvent {
	getNotice(): Promise<RecordNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
