import { Observable } from "rxjs";
import { IStateNoticeEvent, IReassignNameNoticeEvent, IReleaseNameNoticeEvent, IApprovePrimaryNameNoticeEvent, IRemovePrimaryNamesNoticeEvent, ICreditNoticeEvent, IDebitNoticeEvent, ISetRecordEvent } from "../events";
import { AllANTEventsType } from "./responseTypes";

export interface IANTEventHistoryService {
	getStateNoticeEvents(processId: string): Observable<IStateNoticeEvent[]>;
	getFilteredStateNoticeEvents(processId: string): Observable<IStateNoticeEvent[]>;
	getReassignNameNoticeEvents(processId: string): Observable<IReassignNameNoticeEvent[]>;
	getReleaseNameNoticeEvents(processId: string): Observable<IReleaseNameNoticeEvent[]>;
	getApprovePrimaryNameNoticeEvents(processId: string): Observable<IApprovePrimaryNameNoticeEvent[]>;
	getRemovePrimaryNamesNoticeEvents(processId: string): Observable<IRemovePrimaryNamesNoticeEvent[]>;
	getCreditNoticeEvents(processId: string): Observable<ICreditNoticeEvent[]>;
	getDebitNoticeEvents(processId: string): Observable<IDebitNoticeEvent[]>;
	getSetRecordEvents(processId: string): Observable<ISetRecordEvent[]>;
	getAllEvents(processId: string): AllANTEventsType;
}
