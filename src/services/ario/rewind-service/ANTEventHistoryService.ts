import { Observable } from "rxjs";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IANTEvent } from "./events";
import { ANTDataService, IANTDataService } from "../ant-data-service";
import { IANTEventHistoryService } from "./abstract/IANTEventHistoryService";

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

		this.antDataService.getStateNotices(processId)

		throw new Error("Method not implemented.");//TODO
	}

}
