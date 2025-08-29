import { CurrencyAmount } from "../../../../../../models/financial/currency";
import { ExtendLeaseNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ExtendLeaseNoticeTransactionData";
import { ITransactionDataEvent } from "../../abstract";
import { IARNameEvent } from "./IARNameEvent";

export interface IExtendLeaseEvent extends IARNameEvent, ITransactionDataEvent<ExtendLeaseNoticeTransactionData> {
	getTotalFee(): Promise<CurrencyAmount>;
	getPayer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
}
