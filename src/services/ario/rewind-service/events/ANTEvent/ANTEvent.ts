import { Tags, TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../arns-data-service/tags";
import { AntState } from "../../../ant-data-service/types";
import { IANTEvent } from "./abstract";

export class ANTEvent implements IANTEvent {
	private readonly transactionDataPromise: Promise<AntState>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ANTEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<AntState>(
			this.arweaveTransaction.id
		);
	}

	async getNoticeData(): Promise<AntState> {
		return await this.transactionDataPromise;
	}

	async getANTName(): Promise<string> {
		const antState = await this.getNoticeData();
		return antState.Name;
	}

	getANTProcessId(): string {
		return TagUtils.getTagValue(this.getTags(), FROM_PROCESS_TAG_NAME)!;
	}

	getEventMessageId(): string {
		return this.arweaveTransaction.id!
	}

	getEventTimeStamp(): number {
		return this.arweaveTransaction.block?.timestamp!
	}

	getARNSProcessId(): string {
		return TagUtils.getTagValue(this.getTags(), FROM_PROCESS_TAG_NAME)!;
	}

	getARNSName(): string {
		return TagUtils.getTagValue(this.getTags(), ARNS_NAME_TAG_NAME)!;
	}

	toString(): string {
		const timestamp = new Date(this.getEventTimeStamp() * 1000).toISOString();
		return `${this.constructor.name}{messageId: ${this.getEventMessageId()}, timestamp: ${timestamp}, antProcessId: ${this.getANTProcessId()}, arnsName: ${this.getARNSName()}}`;
	}

	// Private //
	private getTags(): Tags {
		return this.arweaveTransaction.tags!
	}
}
