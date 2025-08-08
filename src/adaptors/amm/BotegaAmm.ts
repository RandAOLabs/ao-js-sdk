import { bigint } from "zod";
import { BotegaAmmClient, IBotegaAmmClient, ITokenClient, TokenInfo } from "../../clients";
import { ArweaveTransaction } from "../../core/arweave/abstract/types";
import { CurrencyAmount, IProcess, Process } from "../../models";
import { ITokenBalance, TokenBalance, TokenConfig } from "../../models/token-balance";
import { IAmm } from "./abstract";

export class BotegaAmm implements IAmm {
	constructor(
		private readonly botegaAmmClient: IBotegaAmmClient,
		private readonly process: IProcess
	) {
	}


	public static from(transaction: ArweaveTransaction): IAmm {
		return new BotegaAmm(BotegaAmmClient.from(transaction), Process.from(transaction))
	}
	//Constuctors

	async getQuote(tokenBalance: ITokenBalance): Promise<ITokenBalance> {
		if (await this.isTokenAProcessId(tokenBalance)) {
			return this.getQuoteOfTokenAInTokenB(tokenBalance)
		} else if (await this.isTokenBProcessId(tokenBalance)) {
			return this.getQuoteOfTokenBInTokenA(tokenBalance)
		} else {
			throw new Error(`Token: ${tokenBalance} cannot be used with AMM ${this}`);
		}
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

	private async isTokenAProcessId(tokenBalance: ITokenBalance): Promise<boolean> {
		const tokenAProcessId = (await this.botegaAmmClient.getTokenA()).getProcessId()
		return tokenBalance.getTokenConfig().tokenProcessId == tokenAProcessId
	}

	private async isTokenBProcessId(tokenBalance: ITokenBalance): Promise<boolean> {
		const tokenBProcessId = (await this.botegaAmmClient.getTokenB()).getProcessId()
		return tokenBalance.getTokenConfig().tokenProcessId == tokenBProcessId
	}

	private async getQuoteOfTokenAInTokenB(tokenBalance: ITokenBalance): Promise<TokenBalance> {
		const quote = await this.botegaAmmClient.getPriceOfTokenAInTokenB(tokenBalance.getCurrencyAmount().amount().toString())

		const tokenBClient = await this.botegaAmmClient.getTokenB()
		const tokenBInfo = await tokenBClient.getInfo()

		const currencyAmount = new CurrencyAmount(BigInt(quote), Number(tokenBInfo.denomination!))
		const tokenConfig: TokenConfig = {
			logoTxId: tokenBInfo.logo!,
			name: tokenBInfo.name,
			tokenProcessId: tokenBClient.getProcessId(),
		}

		return new TokenBalance({ currencyAmount, tokenConfig })
	}

	private async getQuoteOfTokenBInTokenA(tokenBalance: ITokenBalance): Promise<TokenBalance> {
		const quote = await this.botegaAmmClient.getPriceOfTokenBInTokenA(tokenBalance.getCurrencyAmount().amount().toString())

		const tokenAClient = await this.botegaAmmClient.getTokenA()
		const tokenAInfo = await tokenAClient.getInfo()

		const currencyAmount = new CurrencyAmount(BigInt(quote), Number(tokenAInfo.denomination!))
		const tokenConfig: TokenConfig = {
			logoTxId: tokenAInfo.logo!,
			name: tokenAInfo.name,
			tokenProcessId: tokenAClient.getProcessId(),
		}

		return new TokenBalance({ currencyAmount, tokenConfig })
	}

}
