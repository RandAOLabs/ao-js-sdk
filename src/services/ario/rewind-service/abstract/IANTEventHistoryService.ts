import { Observable } from "rxjs";
import { IARNameEvent, IANTEvent } from "../events";


export interface IANTEventHistoryService {

	getANTEvents(name: string): Observable<IANTEvent[]>;
}
