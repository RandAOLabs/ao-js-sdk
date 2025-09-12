import { SetNameNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface ISetNameNoticeEvent extends IANTEvent, ITransactionDataEvent<SetNameNoticeTransactionData> {
	getName(): Promise<string>;
}
