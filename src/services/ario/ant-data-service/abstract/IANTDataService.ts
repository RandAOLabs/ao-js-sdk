import { Observable } from "rxjs";
import { ArweaveTransaction, ArweaveTransactionWithData } from "../../../../core/arweave/abstract/types";

export interface IANTDataService {
	getStateNotices(processId: string): Observable<ArweaveTransaction[]>;
	getStateNoticesWithData(processId: string): Observable<ArweaveTransactionWithData[]>;
	getReassignNameNotices(processId: string): Observable<ArweaveTransaction[]>;
	getReleaseNameNotices(processId: string): Observable<ArweaveTransaction[]>;
	getApprovePrimaryNameNotices(processId: string): Observable<ArweaveTransaction[]>;
	getRemovePrimaryNamesNotices(processId: string): Observable<ArweaveTransaction[]>;
	getCreditNotices(processId: string): Observable<ArweaveTransaction[]>;
	getDebitNotices(processId: string): Observable<ArweaveTransaction[]>;
}
