import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../models/financial/currency/CurrencyAmount";
import { PreMainnetRecord } from "./data/pre-mainnet-data";
import { IMainnetInitialState } from "./abstract/IMainnetInitialState";
import { ARIO_TOKEN } from "../../../constants/maps/currencies";

export class MainnetInitialState implements IMainnetInitialState {
	constructor(
		protected readonly preMainnetRecord: PreMainnetRecord,
	) { }

	getEventTimeStamp(): number {
		return this.preMainnetRecord.startTimestamp;
	}

	async getProcessId(): Promise<string> {
		return this.preMainnetRecord.processId;
	}

	async getPurchasePrice(): Promise<CurrencyAmount> {
		return new CurrencyAmount(BigInt(this.preMainnetRecord.purchasePrice), ARIO_TOKEN.decimals);
	}

	async getType(): Promise<string> {
		return this.preMainnetRecord.type;
	}

	async getStartTime(): Promise<number> {
		return this.preMainnetRecord.startTimestamp;
	}

	async getEndTime(): Promise<number | undefined> {
		return this.preMainnetRecord.endTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		return this.preMainnetRecord.undernameLimit;
	}

	getName(): string {
		return this.preMainnetRecord.name;
	}

	getPreMainnetRecord(): PreMainnetRecord {
		return this.preMainnetRecord;
	}

	toString(): string {
		const timestamp = new Date(this.getEventTimeStamp() * 1000).toISOString();
		return `MainnetInitialStateEvent: type: ${this.preMainnetRecord.type}, processId: ${this.preMainnetRecord.processId} timestamp: ${timestamp}`;
	}
}
