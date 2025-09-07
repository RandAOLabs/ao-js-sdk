import { ITokenClient, TokenClient } from "../../clients";
import { Tags } from "../../core";
import { CurrencyAmount, IProcess, Process } from "../../models";
import { EntityId } from "../../models/entity/abstract/EntityType";
import { TokenConfig } from "../../models/financial/token-balance";
import { IToken } from "./abstract/IToken";

export class Token implements IToken {
	private tokenClient: ITokenClient
	constructor(
		public readonly process: IProcess
	) {
		this.tokenClient = TokenClient.defaultBuilder()
			.withProcessId(process.getId())
			.build()
	}

	public async getTokenConfig(): Promise<TokenConfig> {
		const info = await this.tokenClient.getInfo()
		const tokenConfig: TokenConfig = {
			logoTxId: info.logo,
			name: info.name,
			tokenProcessId: this.process.getId(),
		}
		return tokenConfig
	}

	public static fromId(processId: EntityId): IToken {
		const process = new Process(processId)
		return new Token(process)
	}

	async getBalance(entityId: EntityId): Promise<CurrencyAmount> {
		const balance = await this.tokenClient.balance(entityId)
		const decimals = await this.getDecimals()
		return CurrencyAmount.fromDecimal(balance, decimals)
	}
	async transfer(recipient: EntityId, amount: CurrencyAmount, forwardedTags?: Tags): Promise<boolean> {
		const quantity = amount.amountString()
		return this.tokenClient.transfer(recipient, quantity, forwardedTags)
	}
	async getDecimals(): Promise<number> {
		const info = await this.tokenClient.getInfo()
		return Number(info.denomination)
	}
}
