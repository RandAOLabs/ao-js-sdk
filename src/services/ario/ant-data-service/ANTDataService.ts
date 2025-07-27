import { Observable } from "rxjs";
import { switchMap, map, mergeMap, catchError } from "rxjs/operators";
import { from, forkJoin, of } from "rxjs";
import { ArweaveTransaction, ArweaveTransactionWithData } from "../../../core/arweave/abstract/types";
import { IANTDataService } from "./abstract";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IReactiveMessageService, ReactiveMessageService } from "../../messages";
import { IArweaveDataService, ArweaveDataService } from "../../../core";
import { ANT_NOTICE_TAGS } from "../../../models/ario/ant/tags";
import { ANTState } from "../../../models";

/**
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ANTDataService implements IANTDataService {
	constructor(
		private readonly reactiveMessageService: IReactiveMessageService,
		private readonly arweaveDataService: IArweaveDataService,
	) { }

	/**
	 * Creates a pre-configured instance of ANTDataService
	 * @returns A pre-configured ANTDataService instance
	 */
	public static autoConfiguration(): IANTDataService {
		return new ANTDataService(
			ReactiveMessageService.autoConfiguration(),
			ArweaveDataService.autoConfiguration()
		);
	}

	getStateNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.STATE_NOTICE,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getStateNoticesWithData(processId: string): Observable<ArweaveTransactionWithData[]> {
		return this.getStateNotices(processId).pipe(
			switchMap(transactions => {
				if (transactions.length === 0) {
					return from([[]]);
				}

				const dataObservables = transactions.map(transaction =>
					from(this.arweaveDataService.getTransactionData<ANTState>(transaction.id!)).pipe(
						map((data): ArweaveTransactionWithData => ({
							transaction,
							data
						})),
						// Handle errors by returning transaction with null data
						catchError(() => of({
							transaction,
							data: null
						} as ArweaveTransactionWithData))
					)
				);

				return forkJoin(dataObservables);
			})
		);
	}

	getReassignNameNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.REASSIGN_NAME,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getReleaseNameNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.RELEASE_NAME,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getApprovePrimaryNameNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.APPROIVE_PRIMARY_NAME,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getRemovePrimaryNamesNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.REMOVE_PRIMARY_NAMES,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getCreditNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.CREDIT_NOTICE,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getDebitNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.DEBIT_NOTICE,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}

	getSetRecordNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_NOTICE_TAGS.ACTION.SET_RECORD_NOTICE,
				ANT_NOTICE_TAGS.FROM_PROCESS(processId)
			]
		})
	}
}
