import { Observable } from "rxjs";
import { IARNameEvent, IANTEvent, IBuyNameEvent, IExtendLeaseEvent, IIncreaseUndernameEvent, IReassignNameEvent, IRecordEvent, IReturnedNameEvent, IUpgradeNameEvent } from "../events";


export interface IARNameEventHistoryService {

	getBuyNameEvents(name: string): Observable<IBuyNameEvent[]>;

	getExtendLeaseEvents(name: string): Observable<IExtendLeaseEvent[]>;

	getIncreaseUndernameEvents(name: string): Observable<IIncreaseUndernameEvent[]>;

	getReassignNameEvents(name: string): Observable<IReassignNameEvent[]>;

	getRecordEvents(name: string): Observable<IRecordEvent[]>;

	getReturnedNameEvents(name: string): Observable<IReturnedNameEvent[]>;

	getUpgradeNameEvents(name: string): Observable<IUpgradeNameEvent[]>;
}
