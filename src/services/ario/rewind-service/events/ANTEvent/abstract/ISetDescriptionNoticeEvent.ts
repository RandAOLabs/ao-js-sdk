import { SetDescriptionNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface ISetDescriptionNoticeEvent extends IANTEvent, ITransactionDataEvent<SetDescriptionNoticeTransactionData> {
	getDescription(): Promise<string>;
}
