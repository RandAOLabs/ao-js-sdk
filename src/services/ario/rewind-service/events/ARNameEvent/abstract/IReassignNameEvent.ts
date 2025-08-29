import { CurrencyAmount } from "../../../../../../models/financial/currency";
import { ReassignNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { ITransactionDataEvent } from "../../abstract";
import { IARNameEvent } from "./IARNameEvent";

export interface IReassignNameEvent extends IARNameEvent, ITransactionDataEvent<ReassignNameNoticeTransactionData> {
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getReassignedProcessId(): Promise<string>;
}
