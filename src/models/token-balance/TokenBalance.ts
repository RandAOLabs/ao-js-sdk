import { ITokenBalance } from './abstract/ITokenBalance';
import { CurrencyAmount } from '../currency/CurrencyAmount';
import { TokenConfig } from './abstract/types';
import { CreditNotice } from '../../services';

/**
 * Constructor parameters for TokenBalance class.
 */
export interface TokenBalanceConstructorParams {
	currencyAmount: CurrencyAmount;
	tokenConfig: TokenConfig;
}

/**
 * Concrete implementation of ITokenBalance for managing token balances with configuration.
 */
export class TokenBalance implements ITokenBalance {
	/**
	 * Creates a TokenBalance from a credit notice and token configuration
	 * @param creditNotice The credit notice containing quantity information
	 * @param tokenConfig The token configuration for the balance
	 * @returns A new TokenBalance instance
	 */
	public static fromCreditNotice(creditNotice: CreditNotice, tokenConfig: TokenConfig): TokenBalance {
		const denomination = tokenConfig.denomination ?? 12; // Default to 12 if not specified
		const currencyAmount = CurrencyAmount.fromDecimal(
			creditNotice.quantity,
			denomination
		);

		return new TokenBalance({
			currencyAmount,
			tokenConfig
		});
	}
	private readonly currencyAmount: CurrencyAmount;
	private readonly tokenConfig: TokenConfig;

	/**
	 * Creates a new TokenBalance instance.
	 * @param params Constructor parameters containing currencyAmount and tokenConfig
	 */
	constructor({ currencyAmount, tokenConfig }: TokenBalanceConstructorParams) {
		this.currencyAmount = currencyAmount;
		this.tokenConfig = tokenConfig;
	}

	/**
	 * Gets the currency amount for this token balance.
	 * @returns The CurrencyAmount representing the balance
	 */
	getCurrencyAmount(): CurrencyAmount {
		// TODO: Implement currency amount retrieval logic
		return this.currencyAmount;
	}

	/**
	 * Gets the token configuration including metadata.
	 * @returns The TokenConfig with logo and name information
	 */
	getTokenConfig(): TokenConfig {
		// TODO: Implement token config retrieval logic
		return this.tokenConfig;
	}

	toString(): string {
		return `TokenBalance: ${JSON.stringify(this.getTokenConfig())} | ${this.currencyAmount.toString()}`
	}
}
