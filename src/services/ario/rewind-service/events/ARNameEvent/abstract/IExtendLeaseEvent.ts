import { CurrencyAmount } from "../../../../../../models/currency";
import { ExtendLeaseNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ExtendLeaseNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IExtendLeaseEvent extends IARNameEvent {
	getNoticeData(): Promise<ExtendLeaseNoticeTransactionData>;
	getTotalFee(): Promise<CurrencyAmount>;
	getPayer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
