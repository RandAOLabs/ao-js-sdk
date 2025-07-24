import { Observable } from "rxjs";
import { ArweaveTransaction, ArweaveTransactionWithData } from "../../../../core/arweave/abstract/types";

export interface IANTDataService {
	getStateNotices(processId: string): Observable<ArweaveTransaction[]>;
	getStateNoticesWithData(processId: string): Observable<ArweaveTransactionWithData[]>;
}
