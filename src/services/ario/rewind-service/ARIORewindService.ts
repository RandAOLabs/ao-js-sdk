import { Observable, merge } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IReactiveMessageService, ReactiveMessageService } from "../../messages";
import { IARIORewindService } from "./abstract";
import { IARNSNameEvent, IARNSUndernameNameEvent } from "./arns-event";
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

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARIORewindService implements IARIORewindService {
	constructor(
		private readonly arnsDataService: IARNSDataService,
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IARIORewindService {
		return new ARIORewindService(
			ARNSDataService.autoConfiguration(),
		);
	}

	getEventHistory(fullName: string): Observable<IARNSNameEvent[]> {
		const fullARNSName = new FullARNSName(fullName);

		return this.getARNSNameEvents(fullARNSName.getARNSName());
		// TODO: Add undername events support
		// if (fullARNSName.hasUndername()) {
		// 	this.getUnderNameEvents(fullARNSName.getUndername()!)
		// }
	}

	// Private //

	private getARNSNameEvents(name: string): Observable<IARNSNameEvent[]> {
		return merge(
			this.getBuyNameEvents(name),
			this.getExtendLeaseEvents(name),
			this.getIncreaseUndernameEvents(name),
			this.getReassignNameEvents(name),
			this.getRecordEvents(name),
			this.getReturnedNameEvents(name),
			this.getUpgradeNameEvents(name)
		).pipe(
			// Accumulate events as they arrive from different sources
			scan((allEvents: IARNSNameEvent[], newEvents: IARNSNameEvent[]) => {
				return [...allEvents, ...newEvents];
			}, []),
			// Start with an empty array
			startWith([])
		);
	}

	private getBuyNameEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getBuyNameNotices(name).pipe(
			map(transactions => BuyNameEventConverter.convertMany(transactions))
		);
	}

	private getExtendLeaseEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getExtendLeaseNotices(name).pipe(
			map(transactions => ExtendLeaseEventConverter.convertMany(transactions))
		);
	}

	private getIncreaseUndernameEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getIncreaseUndernameNotices(name).pipe(
			map(transactions => IncreaseUndernameEventConverter.convertMany(transactions))
		);
	}

	private getReassignNameEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getReassignNameNotices(name).pipe(
			map(transactions => ReassignNameEventConverter.convertMany(transactions))
		);
	}

	private getRecordEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getRecordNotices(name).pipe(
			map(transactions => RecordEventConverter.convertMany(transactions))
		);
	}

	private getReturnedNameEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getReturnedNameNotices(name).pipe(
			map(transactions => ReturnedNameEventConverter.convertMany(transactions))
		);
	}

	private getUpgradeNameEvents(name: string): Observable<IARNSNameEvent[]> {
		return this.arnsDataService.getUpgradeNameNotices(name).pipe(
			map(transactions => UpgradeNameEventConverter.convertMany(transactions))
		);
	}

	private getUnderNameEvents(undername: string): Observable<IARNSNameEvent[]> {

		throw new Error("Method not implemented.");//TODO
	}

}
