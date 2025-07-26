import { Observable, merge, EMPTY, Subject, firstValueFrom } from "rxjs";
import { map, scan, startWith, shareReplay, mergeMap, catchError, distinct, filter, last } from "rxjs/operators";
import { staticImplements, IAutoconfiguration, Logger } from "../../../utils";
import { IANTEventHistoryService, IARIORewindService, IARNameEventHistoryService } from "./abstract";
import { IARNameEvent, IANTEvent, IARNSEvent, IBuyNameEvent, IReassignNameEvent } from "./events";
import { ARNameEventHistoryService } from "./ARNameEventHistoryService";
import { ANTEventHistoryService } from "./ANTEventHistoryService";
import { ARNameDetail, AllARNameEventsType } from "./abstract/responseTypes";
import { ARIOService, IARIOService } from "../ario-service";
import { FullARNSName } from "../../../models";
import { ANTUtils } from "../../../models/ario/ant/AntUtils";

/**
 * @alpha
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARIORewindService implements IARIORewindService {
	constructor(
		private readonly arnEventHistoryService: IARNameEventHistoryService,
		private readonly antEventHistoryService: IANTEventHistoryService,
		private readonly arioService: IARIOService
	) { }


	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IARIORewindService {
		return new ARIORewindService(
			ARNameEventHistoryService.autoConfiguration(),
			ANTEventHistoryService.autoConfiguration(),
			ARIOService.getInstance()
		);
	}

	public async getAntDetail(fullName: string): Promise<ARNameDetail> {
		const fullARNSName = new FullARNSName(fullName)
		const [currentANTState, currentARNSRecord] = await Promise.all([
			this.arioService.getANTStateForARName(fullName),
			this.arioService.getARNSRecordForARName(fullName)
		]);

		const details: ARNameDetail = {
			name: fullARNSName.getARNSName(),
			startTimestamp: currentARNSRecord?.startTimestamp!,
			endTimestamp: currentARNSRecord?.endTimestamp!,
			type: currentARNSRecord?.type!,
			processId: currentARNSRecord?.processId!,
			controllers: currentANTState.Controllers,
			owner: currentANTState.Owner,
			ttlSeconds: ANTUtils.getRecord(currentANTState, "@")?.ttlSeconds!,
		}
		return details
	}

	public async getEventHistory(fullName: string): Promise<IARNSEvent[]> {
		return firstValueFrom(this.getEventHistory$(fullName).pipe(last()));
	}

	public getEventHistory$(fullName: string): Observable<IARNSEvent[]> {
		const fullARNSName = new FullARNSName(fullName);
		const arnsName = fullARNSName.getARNSName();

		// Get shared event streams from the ARNameEventHistoryService
		const allArnameEvents = this.arnEventHistoryService.getAllEvents(arnsName);
		const arNameEventStream = this.createARNameEventStream(allArnameEvents);

		// Create a stream of process IDs from multiple sources
		const processIdStream = merge(
			// Current ARNS process ID
			this.arioService.getAntProcessId(arnsName),
			// Process IDs from buy name events
			this.extractProcessIdsFromBuyEvents(allArnameEvents.buyNameEvents),
			// Process IDs from reassign name events
			this.extractProcessIdsFromReassignEvents(allArnameEvents.reassignNameEvents)
		).pipe(
			// Filter out null values and trim
			map((processId: string | null) => processId?.trim()),
			filter((processId: string | undefined): processId is string => !!processId)
		);

		const antEventStream = this.createANTEventStreamFromProcessIds(processIdStream);

		return this.combineEventStreams(arNameEventStream, antEventStream);
	}

	/**
	 * Creates a stream of all ARName events using shared event streams
	 */
	private createARNameEventStream(sharedStreams: AllARNameEventsType): Observable<IARNameEvent[]> {
		return merge(
			sharedStreams.buyNameEvents,
			sharedStreams.extendLeaseEvents,
			sharedStreams.increaseUndernameEvents,
			sharedStreams.reassignNameEvents,
			sharedStreams.recordEvents,
			sharedStreams.returnedNameEvents,
			sharedStreams.upgradeNameEvents
		);
	}

	/**
	 * Extracts purchased process IDs from buy name events
	 */
	private extractProcessIdsFromBuyEvents(buyNameEvents: Observable<IARNameEvent[]>): Observable<string | null> {
		return buyNameEvents.pipe(
			mergeMap(events => events),
			mergeMap(async (event: IARNameEvent) => {
				const buyEvent = event as IBuyNameEvent;
				try {
					return await buyEvent.getPurchasedProcessId();
				} catch (error) {
					return null;
				}
			})
		);
	}

	/**
	 * Extracts reassigned process IDs from reassign name events
	 */
	private extractProcessIdsFromReassignEvents(reassignNameEvents: Observable<IARNameEvent[]>): Observable<string | null> {
		return reassignNameEvents.pipe(
			mergeMap(events => events),
			mergeMap(async (event: IARNameEvent) => {
				const reassignEvent = event as IReassignNameEvent;
				try {
					return await reassignEvent.getReassignedProcessId();
				} catch (error) {
					return null;
				}
			})
		);
	}

	/**
	 * Fetches ANT events for a given process ID
	 */
	private fetchANTEventsForProcessId(processId: string | null): Observable<IANTEvent[]> {
		if (!processId) {
			return EMPTY;
		}

		// Combine all ANT event types for the given process ID
		return merge(
			this.antEventHistoryService.getStateNoticeEvents(processId),
			this.antEventHistoryService.getReassignNameNoticeEvents(processId),
			this.antEventHistoryService.getReleaseNameNoticeEvents(processId),
			this.antEventHistoryService.getApprovePrimaryNameNoticeEvents(processId),
			this.antEventHistoryService.getRemovePrimaryNamesNoticeEvents(processId),
			this.antEventHistoryService.getCreditNoticeEvents(processId),
			this.antEventHistoryService.getDebitNoticeEvents(processId)
		).pipe(
			catchError(() => EMPTY)
		);
	}

	/**
	 * Creates a stream of ANT events from a stream of process IDs
	 * Filters for uniqueness and merges all ANT event types for each unique process ID
	 * @param processIdStream - Observable stream of process IDs from multiple sources
	 * @returns Observable<IANTEvent[]> - Stream of merged ANT events
	 */
	public createANTEventStreamFromProcessIds(processIdStream: Observable<string>): Observable<IANTEvent[]> {
		return processIdStream.pipe(
			map((processId: string) => processId.trim()),
			distinct(),
			mergeMap((processId: string) => this.fetchANTEventsForProcessId(processId)),
			shareReplay(1)
		);
	}

	/**
	 * Combines ARName and ANT event streams into a single aggregated stream
	 */
	private combineEventStreams(
		arNameEventStream: Observable<IARNameEvent[]>,
		antEventStream: Observable<IANTEvent[]>
	): Observable<IARNSEvent[]> {
		return merge(arNameEventStream, antEventStream).pipe(
			scan((allEvents: IARNSEvent[], newEvents: IARNSEvent[]) => {
				if (Array.isArray(newEvents)) {
					return [...allEvents, ...newEvents];
				} else {
					return [...allEvents, newEvents];
				}
			}, []),
			startWith([])
		);
	}


}
