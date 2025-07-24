import { CurrencyAmount } from "../../../../../../models/currency";
import { UpgradeNameNoticeTransactionData } from "../../../../arns-data-service/abstract/transaction-data/UpgradeNameNoticeTransactionData";
import { IARNameEvent } from "./IARNameEvent";

export interface IUpgradeNameEvent extends IARNameEvent {
	getNotice(): Promise<UpgradeNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getUndernameLimit(): Promise<number>;
	getName(): Promise<string>;
}
