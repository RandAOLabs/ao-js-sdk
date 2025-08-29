
import { IEntity } from '../../../entity';
import { TokenBalance } from '../../token-balance';

/**
 * Interface for portfolio that manages collections of tokens.
 * Contains an entity for identification and type information.
 */
export interface IPortfolio {
	/**
	 * Gets all tokens in the portfolio.
	 * @returns Array of CurrencyAmount representing the tokens in the portfolio
	 */
	getTokens(): TokenBalance[];

	/**
	 * Gets the entity ID of the portfolio.
	 * @returns The entity ID as a string
	 */
	getEntityId(): string;

	/**
	 * Gets the entity associated with this portfolio.
	 * @returns The IEntity instance
	 */
	getEntity(): IEntity;
}
