import { Observable } from "rxjs";
import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { IARNSDataService } from "./abstract";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IReactiveMessageService, ReactiveMessageService } from "../../messages";
import { ARNS_TAGS } from "../shared";
import { ARIO } from "../../../processes/ids/ario";


@staticImplements<IAutoconfiguration>()
export class ARNSDataService implements IARNSDataService {
	constructor(
		private readonly reactiveMessageService: IReactiveMessageService,
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): IARNSDataService {
		return new ARNSDataService(
			ReactiveMessageService.autoConfiguration()
		);
	}

	getBuyNameNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.BUYNAME_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getRecordNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.RECORD_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getUpgradeNameNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.UPGRADENAME_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getExtendLeaseNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.EXTENDLEASE_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getIncreaseUndernameNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.INCREASEUNDERNAMELIMIT_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getReassignNameNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.REASSIGNNAME_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

	getReturnedNameNotices(name: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ARNS_TAGS.ACTION.RETURNEDNAME_NOTICE,
				ARNS_TAGS.ACTION.NAME(name),
				ARNS_TAGS.ACTION.FROM_PROCESS(ARIO.ARNS_REGISTRY)
			]
		})
	}

}
