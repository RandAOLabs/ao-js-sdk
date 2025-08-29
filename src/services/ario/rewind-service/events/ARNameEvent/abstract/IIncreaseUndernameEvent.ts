import { CurrencyAmount } from "../../../../../../models/financial/currency";
import { IncreaseUndernameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/IncreaseUndernameNoticeTransactionData";
import { ITransactionDataEvent } from "../../abstract";
import { IARNameEvent } from "./IARNameEvent";

export interface IIncreaseUndernameEvent extends IARNameEvent, ITransactionDataEvent<IncreaseUndernameNoticeTransactionData> {
	getTotalFee(): Promise<CurrencyAmount>;
	getPayer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getRecordsCount(): Promise<number>;
}
