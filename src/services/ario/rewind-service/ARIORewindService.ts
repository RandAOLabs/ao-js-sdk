import { Observable, merge } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IANTEventHistoryService, IARIORewindService, IARNameEventHistoryService } from "./abstract";
import { IARNameEvent, IANTEvent, IARNSEvent } from "./events";
import { ARNSDataService, IARNSDataService } from "../arns-data-service";
import { FullARNSName } from "../shared/arns/FullARNSName";
import {
	BuyNameEventConverter,
	ExtendLeaseEventConverter,
	IncreaseUndernameEventConverter,
	ReassignNameEventConverter,
	RecordEventConverter,
	ReturnedNameEventConverter,
	UpgradeNameEventConverter
} from "./converters";
import { ANTDataService, IANTDataService } from "../ant-data-service";
import { ARNameEventHistoryService } from "./ARNameEventHistoryService";
import { ANTEventHistoryService } from "./ANTEventHistoryService";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARIORewindService implements IARIORewindService {
	constructor(
		private readonly arnEventHistoryService: IARNameEventHistoryService,
		private readonly antEventHistoryService: IANTEventHistoryService
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IARIORewindService {
		return new ARIORewindService(
			ARNameEventHistoryService.autoConfiguration(),
			ANTEventHistoryService.autoConfiguration()
		);
	}

	getEventHistory(fullName: string): Observable<IARNSEvent[]> {
		const fullARNSName = new FullARNSName(fullName);

		const buyNameEvents = this.arnEventHistoryService.getBuyNameEvents(fullARNSName.getARNSName())//This One
		const extendLeaseEvents = this.arnEventHistoryService.getExtendLeaseEvents(fullARNSName.getARNSName())
		const increaseUndernameEvents = this.arnEventHistoryService.getIncreaseUndernameEvents(fullARNSName.getARNSName())
		const reassugnNameEvents = this.arnEventHistoryService.getReassignNameEvents(fullARNSName.getARNSName())//This one
		const recordEvents = this.arnEventHistoryService.getRecordEvents(fullARNSName.getARNSName())
		const returnedNameEvents = this.arnEventHistoryService.getReturnedNameEvents(fullARNSName.getARNSName())
		const upgradeNameEvents = this.arnEventHistoryService.getUpgradeNameEvents(fullARNSName.getARNSName())

		return merge(
			buyNameEvents,
			extendLeaseEvents,
			increaseUndernameEvents,
			reassugnNameEvents,
			recordEvents,
			returnedNameEvents,
			upgradeNameEvents,
		).pipe(
			// Accumulate events as they arrive from different sources
			scan((allEvents: IARNameEvent[], newEvents: IARNameEvent[]) => {
				return [...allEvents, ...newEvents];
			}, []),
			// Start with an empty array
			startWith([])
		);
	}


}
