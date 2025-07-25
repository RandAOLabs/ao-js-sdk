import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IANTEvent } from "./events";
import { ANTDataService, IANTDataService } from "../ant-data-service";
import { IANTEventHistoryService } from "./abstract/IANTEventHistoryService";
import { ANTEvent } from "./events/ANTEvent/ANTEvent";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ANTEventHistoryService implements IANTEventHistoryService {
	constructor(
		private readonly antDataService: IANTDataService
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IANTEventHistoryService {
		return new ANTEventHistoryService(
			ANTDataService.autoConfiguration()
		);
	}


	public getANTEvents(processId: string): Observable<IANTEvent[]> {
		return this.antDataService.getStateNotices(processId).pipe(
			map(transactions => transactions.map(transaction => new ANTEvent(transaction)))
		);
	}

}
