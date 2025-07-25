import { CurrencyAmount } from "../../../../../../models/currency";
import { IncreaseUndernameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/IncreaseUndernameNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IIncreaseUndernameEvent extends IARNameEvent {
	getNoticeData(): Promise<IncreaseUndernameNoticeTransactionData>;
	getTotalFee(): Promise<CurrencyAmount>;
	getPayer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getRecordsCount(): Promise<number>;
}
