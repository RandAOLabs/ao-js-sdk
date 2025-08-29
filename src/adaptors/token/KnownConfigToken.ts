import { IProcess, Process } from "../../models";
import { TokenConfig } from "../../models/financial/token-balance";
import { IToken } from "./abstract/IToken";
import { Token } from "./Token";

export class KnownConfigToken extends Token implements IToken {
	constructor(
		private readonly config: TokenConfig
	) {
		super(new Process(config.tokenProcessId!))
	}

	/**
	 *
	 * @override
	 */
	async getDecimals(): Promise<number> {
		return this.config.denomination!
	}
	/**
	 *
	 * @override
	 */
	public async getTokenConfig(): Promise<TokenConfig> {
		return this.config
	}
}
