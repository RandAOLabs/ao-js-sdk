import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { StateNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/StateNoticeTransactionData";
import { IStateNoticeEvent } from "./abstract/IStateNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class StateNoticeEvent extends ANTTransactionDataEvent<StateNoticeTransactionData> implements IStateNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getOwner(): Promise<string> {
		const data = await this.getNoticeData();
		return data.Owner;
	}

	async getTotalSupply(): Promise<number> {
		const data = await this.getNoticeData();
		return data.TotalSupply;
	}

	async getBalances(): Promise<Record<string, number>> {
		const data = await this.getNoticeData();
		return data.Balances;
	}

	async getRecords(): Promise<Record<string, { transactionId: string; ttlSeconds: number }>> {
		const data = await this.getNoticeData();
		return data.Records;
	}

	async getKeywords(): Promise<string[]> {
		const data = await this.getNoticeData();
		return data.Keywords;
	}

	async getDenomination(): Promise<number> {
		const data = await this.getNoticeData();
		return data.Denomination;
	}

	async getControllers(): Promise<string[]> {
		const data = await this.getNoticeData();
		return data.Controllers;
	}

	async getLogo(): Promise<string> {
		const data = await this.getNoticeData();
		return data.Logo;
	}

	async getInitialized(): Promise<boolean> {
		const data = await this.getNoticeData();
		return data.Initialized;
	}

	async getDescription(): Promise<string> {
		const data = await this.getNoticeData();
		return data.Description;
	}

	async getName(): Promise<string> {
		const data = await this.getNoticeData();
		return data.Name;
	}

	async getTicker(): Promise<string> {
		const data = await this.getNoticeData();
		return data.Ticker;
	}
}
