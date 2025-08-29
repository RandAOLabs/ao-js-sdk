import { bigint } from "zod";
import { BotegaAmmClient, IBotegaAmmClient, ITokenClient, TokenClient, TokenInfo } from "../../clients";
import { ArweaveTransaction } from "../../core/arweave/abstract/types";
import { CurrencyAmount, IProcess, Process } from "../../models";
import { ITokenBalance, TokenBalance, TokenConfig } from "../../models/financial/token-balance";
import { IAmm } from "./abstract";
import { Logger } from "../../utils";
import { Token } from "../token/Token";
import { TokenFactory } from "../token";

export class BotegaAmm implements IAmm {
	constructor(
		private readonly botegaAmmClient: IBotegaAmmClient,
		private readonly lpToken: ITokenClient,
		private readonly process: IProcess
	) {
	}



	public static from(transaction: ArweaveTransaction): IAmm {
		const lpToken = TokenClient.defaultBuilder()
			.withProcessId(transaction.id!)
			.build()
		return new BotegaAmm(BotegaAmmClient.from(transaction), lpToken, Process.from(transaction))
	}
	//Constuctors


	async totalSupply(): Promise<bigint> {
		const info = await this.lpToken.getInfo()
		return BigInt(info.totalSupply!)
	}

	async getQuote(tokenBalance: ITokenBalance): Promise<ITokenBalance> {
		if (await this.isTokenAProcessId(tokenBalance)) {
			Logger.debug("Getting Quotes")
			const quote = await this.getQuoteOfTokenAInTokenB(tokenBalance)
			Logger.debug(quote)
			return quote
		} else if (await this.isTokenBProcessId(tokenBalance)) {
			Logger.debug("Getting Quotes")
			const quote = await this.getQuoteOfTokenBInTokenA(tokenBalance)
			Logger.debug(quote)
			return quote
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

		const tokenBProcessId = this.botegaAmmClient.getTokenBProcessId()
		const tokenB = TokenFactory.from(tokenBProcessId)

		const currencyAmount = new CurrencyAmount(BigInt(quote), await tokenB.getDecimals())
		const tokenConfig: TokenConfig = await tokenB.getTokenConfig()

		return new TokenBalance({ currencyAmount, tokenConfig })
	}

	private async getQuoteOfTokenBInTokenA(tokenBalance: ITokenBalance): Promise<TokenBalance> {
		const quote = await this.botegaAmmClient.getPriceOfTokenBInTokenA(tokenBalance.getCurrencyAmount().amount().toString())

		const tokenAProcessId = this.botegaAmmClient.getTokenAProcessId()
		const tokenA = TokenFactory.from(tokenAProcessId)

		const currencyAmount = new CurrencyAmount(BigInt(quote), await tokenA.getDecimals())
		const tokenConfig: TokenConfig = await tokenA.getTokenConfig()

		return new TokenBalance({ currencyAmount, tokenConfig })
	}

}
