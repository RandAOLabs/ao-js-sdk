import { CurrencyAmount } from "../../../../../../models/currency";
import { RecordNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/RecordNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IRecordEvent extends IARNameEvent {
	getNoticeData(): Promise<RecordNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
