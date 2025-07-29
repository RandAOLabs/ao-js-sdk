import { Observable } from "rxjs";
import { IStateNoticeEvent, IReassignNameNoticeEvent, IReleaseNameNoticeEvent, IApprovePrimaryNameNoticeEvent, IRemovePrimaryNamesNoticeEvent, ICreditNoticeEvent, IDebitNoticeEvent, IBuyNameEvent, IExtendLeaseEvent, IIncreaseUndernameEvent, IReassignNameEvent, IRecordEvent, IReturnedNameEvent, IUpgradeNameEvent, ISetRecordEvent } from "../events";
import { AntRecord } from "../../../../models";

export interface ARNameDetail {
	name: string,
	startTimestamp: number,
	endTimestamp: number,
	type: string,
	processId: string,
	controllers: string[],
	owner: string,
	ttlSeconds: number,
	logoTxId: string
	records: Record<string, AntRecord>,
	targetId: string,
	undernameLimit: number,
	leaseDuration: string,
	expiryDate: Date
}

export type AllARNameEventsType = {
	buyNameEvents: Observable<IBuyNameEvent[]>;
	extendLeaseEvents: Observable<IExtendLeaseEvent[]>;
	increaseUndernameEvents: Observable<IIncreaseUndernameEvent[]>;
	reassignNameEvents: Observable<IReassignNameEvent[]>;
	recordEvents: Observable<IRecordEvent[]>;
	returnedNameEvents: Observable<IReturnedNameEvent[]>;
	upgradeNameEvents: Observable<IUpgradeNameEvent[]>;
};

export type AllANTEventsType = {
	stateNoticeEvents: Observable<IStateNoticeEvent[]>;
	reassignNameNoticeEvents: Observable<IReassignNameNoticeEvent[]>;
	releaseNameNoticeEvents: Observable<IReleaseNameNoticeEvent[]>;
	approvePrimaryNameNoticeEvents: Observable<IApprovePrimaryNameNoticeEvent[]>;
	removePrimaryNamesNoticeEvents: Observable<IRemovePrimaryNamesNoticeEvent[]>;
	creditNoticeEvents: Observable<ICreditNoticeEvent[]>;
	debitNoticeEvents: Observable<IDebitNoticeEvent[]>;
	setRecordEvents: Observable<ISetRecordEvent[]>
};
