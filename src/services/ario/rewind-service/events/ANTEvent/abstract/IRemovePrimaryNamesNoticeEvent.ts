import { RemovePrimaryNamesNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IRemovePrimaryNamesNoticeEvent extends IANTEvent, ITransactionDataEvent<RemovePrimaryNamesNoticeTransactionData> {
	// TODO: Add specific methods for RemovePrimaryNamesNotice event
}
