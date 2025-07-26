import { ReassignNameNoticeANTTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IReassignNameNoticeEvent extends IANTEvent, ITransactionDataEvent<ReassignNameNoticeANTTransactionData> {
	// TODO: Add specific methods for ReassignNameNotice event
}
