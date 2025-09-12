import { SetTickerNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface ISetTickerNoticeEvent extends IANTEvent, ITransactionDataEvent<SetTickerNoticeTransactionData> {
	getTicker(): Promise<string>;
}
