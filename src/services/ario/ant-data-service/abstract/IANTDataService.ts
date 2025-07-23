import { Observable } from "rxjs";
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";

export interface IANTDataService {
	getStateNotices(processId: string): Observable<ArweaveTransaction[]>;
}
