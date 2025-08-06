import { bigint } from "zod";
import { BotegaAmmClient, IBotegaAmmClient, ITokenClient, TokenInfo } from "../../clients";
import { ArweaveTransaction } from "../../core/arweave/abstract/types";
import { CurrencyAmount, IProcess, Process } from "../../models";
import { TokenBalance, TokenConfig } from "../../models/token-balance";
import { IAmm } from "./abstract";

export class BotegaAmm implements IAmm {
	public readonly process: IProcess;
	constructor(
		private readonly botegaAmmClient: IBotegaAmmClient
	) {
		this.process = new Process(botegaAmmClient.getProcessId())
	}

	public static from(transaction: ArweaveTransaction): IAmm {
		return new BotegaAmm(BotegaAmmClient.from(transaction))
	}

	async getPrice(quantity: number | string, tokenId: string): Promise<TokenBalance> {
		const price = await this.botegaAmmClient.getPrice(quantity, tokenId);

		const otherTokenInfo = await this.getOtherTokenInfo(tokenId)
		const currencyAmount = new CurrencyAmount(BigInt(price), Number(otherTokenInfo.denomination!))
		const tokenConfig: TokenConfig = {
			logoTxId: otherTokenInfo.logo!,
			name: otherTokenInfo.name,
			tokenProcessId: await this.getOtherTokensProcessId(tokenId),
		}

		return new TokenBalance({ currencyAmount, tokenConfig })
	}

	public getProcess(): IProcess {
		return this.process
	}

	///////////////
	private async getOtherTokensProcessId(tokenId: string): Promise<string> {
		const otherToken = await this.getOtherToken(tokenId)
		return otherToken.getProcessId()
	}

	private async getOtherTokenInfo(tokenId: string): Promise<TokenInfo> {
		const otherToken = await this.getOtherToken(tokenId)
		return otherToken.getInfo()
	}

	private async getOtherToken(tokenId: string): Promise<ITokenClient> {
		const tokenA = await this.botegaAmmClient.getTokenA()
		if (tokenA.getProcessId() != tokenId) {
			return tokenA
		}

		return await this.botegaAmmClient.getTokenB()
	}
}
