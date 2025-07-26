import { ReleaseNameNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IReleaseNameNoticeEvent extends IANTEvent, ITransactionDataEvent<ReleaseNameNoticeTransactionData> {
	// TODO: Add specific methods for ReleaseNameNotice event
}
