import { Tags, TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../../../models/ario/arns/tags";
import { IARNameEvent } from "./abstract/IARNameEvent";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { ARNSEvent } from "../ARNSEvent";
import { ITransactionDataEvent } from "../abstract";
import { ARNameEvent } from "./ARNameEvent";

export class ARNameTransactionDataEvent<T = any> extends ARNameEvent implements ITransactionDataEvent<T> {
	protected readonly transactionDataPromise: Promise<T>;
	protected readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction)
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ARNameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<T>(
			this.arweaveTransaction.id
		);
	}

	async getNoticeData(): Promise<T> {
		return await this.transactionDataPromise;
	}

}
