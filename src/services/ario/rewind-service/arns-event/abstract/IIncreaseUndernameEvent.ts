import { CurrencyAmount } from "../../../../../models/currency";
import { IncreaseUndernameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/IncreaseUndernameNoticeTransactionData";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IIncreaseUndernameEvent extends IARNSNameEvent {
	getNotice(): Promise<IncreaseUndernameNoticeTransactionData>;
	getTotalFee(): Promise<CurrencyAmount>;
	getPayer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getRecordsCount(): Promise<number>;
}
