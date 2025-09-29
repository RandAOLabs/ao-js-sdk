import { Observable, merge, EMPTY, firstValueFrom } from "rxjs";
import { map, scan, startWith, shareReplay, mergeMap, catchError, distinct, filter, last } from "rxjs/operators";
import { staticImplements, IAutoconfiguration, Logger, ServiceErrorHandler, createSeededRandom } from "../../../utils";
import { ARNameEventHistoryService } from "./ARNameEventHistoryService";
import { ANTEventHistoryService } from "./ANTEventHistoryService";
import { ARNSInitialMainnetStateService } from "../arns-initial-mainnet-state-service/ARNSInitialMainnetStateService";
import { ARNameDetail, AllARNameEventsType } from "./abstract/responseTypes";
import { ARIOService, IARIOService } from "../ario-service";
import { FullARNSName } from "../../../models";
import { ANTUtils } from "../../../models/ario/ant/AntUtils";
import { EntityService, IEntityService } from "../../entity";
import { EntityType } from "../../../models/entity/abstract/EntityType";
import { IService, Service } from "../../common";
import { IANTEventHistoryService, IARIORewindService, IARNameEventHistoryService } from "./abstract";
import { IARNSInitialMainnetStateService, IMainnetInitialState } from "../arns-initial-mainnet-state-service";
import { IANTEvent, IARNameEvent, IARNSEvent, IBuyNameEvent, IReassignNameEvent } from "./events";
import { ARNSClient } from "../../../clients/ario/arns/ARNSClient";
import { RandAOService, IRandAOService } from "../../randao";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARIORewindService extends Service implements IARIORewindService {
	constructor(
		private readonly arnEventHistoryService: IARNameEventHistoryService,
		private readonly antEventHistoryService: IANTEventHistoryService,
		private readonly arnsInitialMainnetStateService: IARNSInitialMainnetStateService,
		private readonly arioService: IARIOService,
		private readonly entityService: IEntityService,
		private readonly arnsClient: ARNSClient,
		private readonly randAOService: IRandAOService,
	) {
		super();
	}


	/**
	 * Creates a pre-configured instance of ARIORewindService
	 * @returns A pre-configured ARIORewindService instance
	 * @constructor
	 */
	public static async autoConfiguration(): Promise<IARIORewindService> {
		return new ARIORewindService(
			ARNameEventHistoryService.autoConfiguration(),
			ANTEventHistoryService.autoConfiguration(),
			ARNSInitialMainnetStateService.autoConfiguration(),
			ARIOService.getInstance(),
			EntityService.autoConfiguration(),
			ARNSClient.autoConfiguration(),
			await RandAOService.autoConfiguration()
		);
	}

	public getServiceName(): string {
		return 'ARNSInitialMainnetStateService';
	}

	public getMainnetInitialState(name: string): IMainnetInitialState | undefined {
		return this.arnsInitialMainnetStateService.getMainnetInitialState(name);
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
			logoTxId: currentANTState.Logo,
			records: currentANTState.Records,
			targetId: ANTUtils.getRecord(currentANTState, "@")?.transactionId!,
			undernameLimit: currentARNSRecord?.undernameLimit!,
			expiryDate: new Date(currentARNSRecord?.endTimestamp!),
			leaseDuration: this.calculateLeaseDuration(currentARNSRecord?.startTimestamp!, currentARNSRecord?.endTimestamp!)
		};
		return details;
	}

	public async getEventHistory(fullName: string): Promise<IARNSEvent[]> {
		return firstValueFrom(this.getEventHistory$(fullName).pipe(last()));;
	}

	public getEventHistory$(fullName: string): Observable<IARNSEvent[]> {
		const fullARNSName = new FullARNSName(fullName);
		const arnsName = fullARNSName.getARNSName();

		// Get shared event streams from the ARNameEventHistoryService
		const allArNameEvents = this.arnEventHistoryService.getAllEvents(arnsName);
		const arNameEventStream = this.createARNameEventStream(allArNameEvents);

		// Create a stream of process IDs from multiple sources
		const processIdStream = merge(
			// Current ARNS process ID
			this.arioService.getAntProcessId(arnsName).pipe(catchError(() => EMPTY)),
			// Process IDs from buy name events
			this.extractProcessIdsFromBuyEvents(allArNameEvents.buyNameEvents),
			// Process IDs from reassign name events
			this.extractProcessIdsFromReassignEvents(allArNameEvents.reassignNameEvents)
		).pipe(
			// Filter out null values and trim
			map((processId: string | null) => processId?.trim()),
			filter((processId: string | undefined): processId is string => !!processId)
		);

		const antEventStream = this.createANTEventStreamFromProcessIds(processIdStream);
		const allEvents = this.combineEventStreams(arNameEventStream, antEventStream);
		const filteredEvents = this.filterEvents(allEvents);
		const sortedEvents = this.sortEvents(filteredEvents);
		return filteredEvents;
	}


	/**
	 * Creates a stream of all ARName events using shared event streams (excluding mainnet initial state)
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
			this.antEventHistoryService.getFilteredStateNoticeEvents(processId), // Filtered
			// this.antEventHistoryService.getReassignNameNoticeEvents(processId), // Removed in favor of reassign events from the registry
			this.antEventHistoryService.getReleaseNameNoticeEvents(processId),
			this.antEventHistoryService.getApprovePrimaryNameNoticeEvents(processId),
			this.antEventHistoryService.getRemovePrimaryNamesNoticeEvents(processId),
			this.antEventHistoryService.getCreditNoticeEvents(processId),
			this.antEventHistoryService.getDebitNoticeEvents(processId),
			this.antEventHistoryService.getSetRecordEvents(processId),
			this.antEventHistoryService.getSetNameNoticeEvents(processId),
			this.antEventHistoryService.getSetDescriptionNoticeEvents(processId),
			this.antEventHistoryService.getSetTickerNoticeEvents(processId)
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
				let updatedEvents: IARNSEvent[];
				if (Array.isArray(newEvents)) {
					updatedEvents = [...allEvents, ...newEvents];
				} else {
					updatedEvents = [...allEvents, newEvents];
				}
				// Sort events by timestamp
				return updatedEvents.sort((a, b) => a.getEventTimeStamp() - b.getEventTimeStamp());
			}, []),
			startWith([])
		);
	}


	/**
	 * Sorts events by timestamp
	 */
	private sortEvents(allEvents: Observable<IARNSEvent[]>): Observable<IARNSEvent[]> {
		return allEvents.pipe(
			map(events =>
				[...events].sort((a, b) => a.getEventTimeStamp() - b.getEventTimeStamp())
			)
		);
	}


	/**
	 * Filters ReassignNameEvent events based on entity type:
	 * - Keep events where getNotified() returns a User entity
	 * - Filter out events where getNotified() returns a Process entity
	 * @param allEvents - Observable stream of all events
	 * @returns Observable<IARNSEvent[]> - Filtered events stream
	 */
	private filterEvents(allEvents: Observable<IARNSEvent[]>): Observable<IARNSEvent[]> {
		return allEvents.pipe(
			mergeMap(async (events: IARNSEvent[]) => {
				const filteredEvents: IARNSEvent[] = [];

				// Process events sequentially to avoid overwhelming the EntityService
				for (const event of events) {
					if (this.isReassignNameEvent(event)) {
						const reassignEvent = event as IReassignNameEvent;
						try {
							const entity = await this.entityService.getEntity(reassignEvent.getNotified());
							// Keep event if it's a User, filter out if it's a Process
							if (entity.getType() === EntityType.USER) {
								filteredEvents.push(event);
							} else {
								Logger.debug(`Filtered out ReassignNameEvent for Process entity: ${reassignEvent.getNotified()}`);
							}
						} catch (error) {
							// If there's an error getting the entity, keep the event to be safe
							filteredEvents.push(event);
						}
					} else {
						// Keep all other events
						filteredEvents.push(event);
					}
				}

				return filteredEvents;
			})
		);
	}


	/**
	 * Type guard to check if an event is a ReassignNameEvent
	 * @param event - The event to check
	 * @returns boolean - True if the event is a ReassignNameEvent
	 */
	private isReassignNameEvent(event: IARNSEvent): event is IReassignNameEvent {
		// Check if the event has the getReassignedProcessId method which is unique to IReassignNameEvent
		return 'getReassignedProcessId' in event && typeof (event as any).getReassignedProcessId === 'function';
	}


	/**
	 * Calculates the lease duration in years between start and end timestamps
	 * @param startTimestamp - Start timestamp in milliseconds
	 * @param endTimestamp - End timestamp in milliseconds
	 * @returns Formatted string like "2 years"
	 */
	private calculateLeaseDuration(startTimestamp: number, endTimestamp: number): string {
		const startDate = new Date(startTimestamp);
		const endDate = new Date(endTimestamp);

		// Calculate the difference in years
		let years = endDate.getFullYear() - startDate.getFullYear();

		// Adjust for partial years by checking if the end date hasn't reached the anniversary
		const monthDiff = endDate.getMonth() - startDate.getMonth();
		const dayDiff = endDate.getDate() - startDate.getDate();

		if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			years--;
		}

		// Handle singular vs plural
		return years === 1 ? "1 year" : `${years} years`;
	}

	public async getRandomARNSName(): Promise<string> {
		try {
			// Run both async operations concurrently for better performance
			const [entropy, arnsRecords] = await Promise.all([
				this.randAOService.getMostRecentEntropy(),
				this.arnsClient.getArNSRecords()
			]);

			if (!arnsRecords.items || arnsRecords.items.length === 0) {
				throw new Error('No ARNS names found');
			}

			// Use the secure seeded random generator
			const seededRandom = createSeededRandom(entropy);
			return await seededRandom.selectRandom(arnsRecords.items.map(item => item.name));
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.warn(`Failed to get random ARNS name: ${errorMessage}`);
			throw error;
		}
	}
}
