import { Observable } from "rxjs";
import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { IANTDataService } from "./abstract";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IReactiveMessageService, ReactiveMessageService } from "../../messages";
import { ANT_TAGS } from "./tags";

@staticImplements<IAutoconfiguration>()
export class ANTDataService implements IANTDataService {
	constructor(
		private readonly reactiveMessageService: IReactiveMessageService,
	) { }

	/**
	 * Creates a pre-configured instance of ANTDataService
	 * @returns A pre-configured ANTDataService instance
	 */
	public static autoConfiguration(): IANTDataService {
		return new ANTDataService(
			ReactiveMessageService.autoConfiguration()
		);
	}

	getStateNotices(processId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				ANT_TAGS.ACTION.STATE_NOTICE,
				ANT_TAGS.ACTION.FROM_PROCESS(processId)
			]
		})
	}
}
