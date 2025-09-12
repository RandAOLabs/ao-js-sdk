import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IStateNoticeEvent, IReassignNameNoticeEvent, IReleaseNameNoticeEvent, IApprovePrimaryNameNoticeEvent, IRemovePrimaryNamesNoticeEvent, ICreditNoticeEvent, IDebitNoticeEvent, ISetRecordEvent, ISetNameNoticeEvent, ISetDescriptionNoticeEvent, ISetTickerNoticeEvent } from "./events";
import { ANTDataService, IANTDataService } from "../ant-data-service";
import { IANTEventHistoryService } from "./abstract/IANTEventHistoryService";
import { StateNoticeEvent, ReassignNameNoticeEvent, ReleaseNameNoticeEvent, ApprovePrimaryNameNoticeEvent, RemovePrimaryNamesNoticeEvent, CreditNoticeEvent, DebitNoticeEvent, SetNameNoticeEvent, SetDescriptionNoticeEvent, SetTickerNoticeEvent } from "./events";
import { AllANTEventsType } from "./abstract/responseTypes";
import { SetRecordEvent } from "./events/ANTEvent/SetRecordEvent";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ANTEventHistoryService implements IANTEventHistoryService {
	constructor(
		private readonly antDataService: IANTDataService
	) { }

	/**
	 * Creates a pre-configured instance of ANTEventHistoryService
	 * @returns A pre-configured ANTEventHistoryService instance
	 * @constructor
	 */
	public static autoConfiguration(): IANTEventHistoryService {
		return new ANTEventHistoryService(
			ANTDataService.autoConfiguration()
		);
	}

	public getStateNoticeEvents(processId: string): Observable<IStateNoticeEvent[]> {
		return this.antDataService.getStateNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new StateNoticeEvent(transaction)))
		);
	}

	public getFilteredStateNoticeEvents(processId: string): Observable<IStateNoticeEvent[]> {
		return this.getStateNoticeEvents(processId).pipe(
			map(events => events.filter(event => event.getNotified() !== event.getANTProcessId()))
		);
	}

	public getReassignNameNoticeEvents(processId: string): Observable<IReassignNameNoticeEvent[]> {
		return this.antDataService.getReassignNameNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new ReassignNameNoticeEvent(transaction)))
		);
	}

	public getReleaseNameNoticeEvents(processId: string): Observable<IReleaseNameNoticeEvent[]> {
		return this.antDataService.getReleaseNameNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new ReleaseNameNoticeEvent(transaction)))
		);
	}

	public getApprovePrimaryNameNoticeEvents(processId: string): Observable<IApprovePrimaryNameNoticeEvent[]> {
		return this.antDataService.getApprovePrimaryNameNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new ApprovePrimaryNameNoticeEvent(transaction)))
		);
	}

	public getRemovePrimaryNamesNoticeEvents(processId: string): Observable<IRemovePrimaryNamesNoticeEvent[]> {
		return this.antDataService.getRemovePrimaryNamesNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new RemovePrimaryNamesNoticeEvent(transaction)))
		);
	}

	public getCreditNoticeEvents(processId: string): Observable<ICreditNoticeEvent[]> {
		return this.antDataService.getCreditNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new CreditNoticeEvent(transaction)))
		);
	}

	public getDebitNoticeEvents(processId: string): Observable<IDebitNoticeEvent[]> {
		return this.antDataService.getDebitNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new DebitNoticeEvent(transaction)))
		);
	}

	public getSetRecordEvents(processId: string): Observable<ISetRecordEvent[]> {
		return this.antDataService.getSetRecordNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new SetRecordEvent(transaction)))
		);
	}

	public getSetNameNoticeEvents(processId: string): Observable<ISetNameNoticeEvent[]> {
		return this.antDataService.getSetNameNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new SetNameNoticeEvent(transaction)))
		);
	}

	public getSetDescriptionNoticeEvents(processId: string): Observable<ISetDescriptionNoticeEvent[]> {
		return this.antDataService.getSetDescriptionNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new SetDescriptionNoticeEvent(transaction)))
		);
	}

	public getSetTickerNoticeEvents(processId: string): Observable<ISetTickerNoticeEvent[]> {
		return this.antDataService.getSetTickerNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new SetTickerNoticeEvent(transaction)))
		);
	}

	public getAllEvents(processId: string): AllANTEventsType {
		return {
			stateNoticeEvents: this.getStateNoticeEvents(processId),
			reassignNameNoticeEvents: this.getReassignNameNoticeEvents(processId),
			releaseNameNoticeEvents: this.getReleaseNameNoticeEvents(processId),
			approvePrimaryNameNoticeEvents: this.getApprovePrimaryNameNoticeEvents(processId),
			removePrimaryNamesNoticeEvents: this.getRemovePrimaryNamesNoticeEvents(processId),
			creditNoticeEvents: this.getCreditNoticeEvents(processId),
			debitNoticeEvents: this.getDebitNoticeEvents(processId),
			setRecordEvents: this.getSetRecordEvents(processId),
			setNameNoticeEvents: this.getSetNameNoticeEvents(processId),
			setDescriptionNoticeEvents: this.getSetDescriptionNoticeEvents(processId),
			setTickerNoticeEvents: this.getSetTickerNoticeEvents(processId)
		};
	}
}
