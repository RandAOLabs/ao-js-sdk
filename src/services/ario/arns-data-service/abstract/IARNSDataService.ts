import { Observable } from "rxjs/internal/Observable";
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";

export interface IARNSDataService {
	getBuyNameNotices(name: string): Observable<ArweaveTransaction[]>;
	getRecordNotices(name: string): Observable<ArweaveTransaction[]>;
	getUpgradeNameNotices(name: string): Observable<ArweaveTransaction[]>;
	getExtendLeaseNotices(name: string): Observable<ArweaveTransaction[]>;
	getIncreaseUndernameNotices(name: string): Observable<ArweaveTransaction[]>;
	getReassignNameNotices(name: string): Observable<ArweaveTransaction[]>;
	getReturnedNameNotices(name: string): Observable<ArweaveTransaction[]>;
}
