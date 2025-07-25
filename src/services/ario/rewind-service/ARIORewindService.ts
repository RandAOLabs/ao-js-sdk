import { Observable, merge, EMPTY } from "rxjs";
import { map, scan, startWith, switchMap, shareReplay, mergeMap, catchError } from "rxjs/operators";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IANTEventHistoryService, IARIORewindService, IARNameEventHistoryService } from "./abstract";
import { IARNameEvent, IANTEvent, IARNSEvent, IBuyNameEvent, IReassignNameEvent } from "./events";
import { FullARNSName } from "../shared/arns/FullARNSName";
import { ARNameEventHistoryService } from "./ARNameEventHistoryService";
import { ANTEventHistoryService } from "./ANTEventHistoryService";

/**
 * @category ARIO
 * @alpha
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
		const arnsName = fullARNSName.getARNSName();

		// Create shared event streams to avoid duplicate queries
		const sharedEventStreams = this.createSharedEventStreams(arnsName);
		const arNameEventStream = this.createARNameEventStream(sharedEventStreams);
		const antEventStream = this.createANTEventStream(sharedEventStreams);

		return this.combineEventStreams(arNameEventStream, antEventStream);
	}

	/**
	 * Creates shared event streams to avoid duplicate queries
	 */
	private createSharedEventStreams(arnsName: string): {
		buyNameEvents: Observable<IARNameEvent[]>;
		extendLeaseEvents: Observable<IARNameEvent[]>;
		increaseUndernameEvents: Observable<IARNameEvent[]>;
		reassignNameEvents: Observable<IARNameEvent[]>;
		recordEvents: Observable<IARNameEvent[]>;
		returnedNameEvents: Observable<IARNameEvent[]>;
		upgradeNameEvents: Observable<IARNameEvent[]>;
	} {
		return {
			buyNameEvents: this.arnEventHistoryService.getBuyNameEvents(arnsName).pipe(shareReplay(1)),
			extendLeaseEvents: this.arnEventHistoryService.getExtendLeaseEvents(arnsName).pipe(shareReplay(1)),
			increaseUndernameEvents: this.arnEventHistoryService.getIncreaseUndernameEvents(arnsName).pipe(shareReplay(1)),
			reassignNameEvents: this.arnEventHistoryService.getReassignNameEvents(arnsName).pipe(shareReplay(1)),
			recordEvents: this.arnEventHistoryService.getRecordEvents(arnsName).pipe(shareReplay(1)),
			returnedNameEvents: this.arnEventHistoryService.getReturnedNameEvents(arnsName).pipe(shareReplay(1)),
			upgradeNameEvents: this.arnEventHistoryService.getUpgradeNameEvents(arnsName).pipe(shareReplay(1))
		};
	}

	/**
	 * Creates a stream of all ARName events using shared event streams
	 */
	private createARNameEventStream(sharedStreams: ReturnType<typeof this.createSharedEventStreams>): Observable<IARNameEvent[]> {
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
	 * Creates a stream of ANT events by extracting process IDs from shared buy and reassign events
	 */
	private createANTEventStream(sharedStreams: ReturnType<typeof this.createSharedEventStreams>): Observable<IANTEvent[]> {
		const processedProcessIds = new Set<string>();

		const processIdStream = this.extractProcessIdsFromEvents(
			sharedStreams.buyNameEvents,
			sharedStreams.reassignNameEvents
		);

		return processIdStream.pipe(
			map((processId: string | null) => this.filterDuplicateProcessIds(processId, processedProcessIds)),
			switchMap((processId: string | null) => this.fetchANTEventsForProcessId(processId)),
			shareReplay(1)
		);
	}

	/**
	 * Extracts process IDs from buy and reassign name events
	 */
	private extractProcessIdsFromEvents(
		buyNameEvents: Observable<IARNameEvent[]>,
		reassignNameEvents: Observable<IARNameEvent[]>
	): Observable<string | null> {
		return merge(
			this.extractProcessIdsFromBuyEvents(buyNameEvents),
			this.extractProcessIdsFromReassignEvents(reassignNameEvents)
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
	 * Filters out null values and duplicate process IDs
	 */
	private filterDuplicateProcessIds(processId: string | null, processedProcessIds: Set<string>): string | null {
		if (!processId) {
			return null;
		}

		const trimmedId = processId.trim();
		if (!trimmedId || processedProcessIds.has(trimmedId)) {
			return null;
		}

		processedProcessIds.add(trimmedId);
		return trimmedId;
	}

	/**
	 * Fetches ANT events for a given process ID
	 */
	private fetchANTEventsForProcessId(processId: string | null): Observable<IANTEvent[]> {
		if (!processId) {
			return EMPTY;
		}

		return this.antEventHistoryService.getANTEvents(processId).pipe(
			catchError(() => EMPTY)
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
