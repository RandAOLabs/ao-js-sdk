import { ApprovePrimaryNameNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IApprovePrimaryNameNoticeEvent extends IANTEvent, ITransactionDataEvent<ApprovePrimaryNameNoticeTransactionData> {
	// TODO: Add specific methods for ApprovePrimaryNameNotice event
}
