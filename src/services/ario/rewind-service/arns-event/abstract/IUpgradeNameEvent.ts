import { CurrencyAmount } from "../../../../../models/currency";
import { UpgradeNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/UpgradeNameNoticeTransactionData";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IUpgradeNameEvent extends IARNSNameEvent {
	getNotice(): Promise<UpgradeNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getName(): Promise<string>;
}
