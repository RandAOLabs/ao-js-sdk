import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IARNameEvent, IBuyNameEvent, IExtendLeaseEvent, IIncreaseUndernameEvent, IReassignNameEvent, IRecordEvent, IReturnedNameEvent, IUpgradeNameEvent } from "./events";
import { ARNSDataService, IARNSDataService } from "../arns-data-service";
import {
	BuyNameEventConverter,
	ExtendLeaseEventConverter,
	IncreaseUndernameEventConverter,
	ReassignNameEventConverter,
	RecordEventConverter,
	ReturnedNameEventConverter,
	UpgradeNameEventConverter
} from "./converters";
import { IARNameEventHistoryService } from "./abstract/IARNameEventHistoryService";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARNameEventHistoryService implements IARNameEventHistoryService {
	constructor(
		private readonly arnsDataService: IARNSDataService,
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IARNameEventHistoryService {
		return new ARNameEventHistoryService(
			ARNSDataService.autoConfiguration()
		);
	}

	public getBuyNameEvents(name: string): Observable<IBuyNameEvent[]> {
		return this.arnsDataService.getBuyNameNotices(name).pipe(
			map(transactions => BuyNameEventConverter.convertMany(transactions))
		);
	}

	public getExtendLeaseEvents(name: string): Observable<IExtendLeaseEvent[]> {
		return this.arnsDataService.getExtendLeaseNotices(name).pipe(
			map(transactions => ExtendLeaseEventConverter.convertMany(transactions))
		);
	}

	public getIncreaseUndernameEvents(name: string): Observable<IIncreaseUndernameEvent[]> {
		return this.arnsDataService.getIncreaseUndernameNotices(name).pipe(
			map(transactions => IncreaseUndernameEventConverter.convertMany(transactions))
		);
	}

	public getReassignNameEvents(name: string): Observable<IReassignNameEvent[]> {
		return this.arnsDataService.getReassignNameNotices(name).pipe(
			map(transactions => ReassignNameEventConverter.convertMany(transactions))
		);
	}

	public getRecordEvents(name: string): Observable<IRecordEvent[]> {
		return this.arnsDataService.getRecordNotices(name).pipe(
			map(transactions => RecordEventConverter.convertMany(transactions))
		);
	}

	public getReturnedNameEvents(name: string): Observable<IReturnedNameEvent[]> {
		return this.arnsDataService.getReturnedNameNotices(name).pipe(
			map(transactions => ReturnedNameEventConverter.convertMany(transactions))
		);
	}

	public getUpgradeNameEvents(name: string): Observable<IUpgradeNameEvent[]> {
		return this.arnsDataService.getUpgradeNameNotices(name).pipe(
			map(transactions => UpgradeNameEventConverter.convertMany(transactions))
		);
	}

}
