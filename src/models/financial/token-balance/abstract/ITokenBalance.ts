import { CurrencyAmount } from '../../currency/CurrencyAmount';
import { TokenConfig } from './types';

/**
 * Interface for token balance that manages a currency amount and token configuration.
 */
export interface ITokenBalance {
	/**
	 * Gets the currency amount for this token balance.
	 * @returns The CurrencyAmount representing the balance
	 */
	getCurrencyAmount(): CurrencyAmount;

	/**
	 * Gets the token configuration including metadata.
	 * @returns The TokenConfig with logo and name information
	 */
	getTokenConfig(): TokenConfig;

	toString(): string;
}
