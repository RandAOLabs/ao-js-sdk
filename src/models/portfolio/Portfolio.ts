import { IPortfolio } from './abstract/IPortfolio';
import { CurrencyAmount } from '../currency/CurrencyAmount';
import { Process } from '../entity/process/Process';
import { IEntity } from '../entity/abstract/IEntity';

/**
 * Constructor parameters for Portfolio class.
 */
export interface PortfolioConstructorParams {
	entityId: string;
	tokens: CurrencyAmount[];
}

/**
 * Concrete implementation of IPortfolio for managing collections of tokens.
 * Uses composition with an Entity for identification and type information.
 */
export class Portfolio implements IPortfolio {
	private readonly entity: IEntity;
	private readonly tokens: CurrencyAmount[];

	/**
	 * Creates a new Portfolio instance.
	 * @param params Constructor parameters containing entityId and tokens
	 */
	constructor({ entityId, tokens }: PortfolioConstructorParams) {
		this.entity = new Process(entityId);
		this.tokens = tokens;
	}

	/**
	 * Gets all tokens in the portfolio.
	 * @returns Array of CurrencyAmount representing the tokens in the portfolio
	 */
	getTokens(): CurrencyAmount[] {
		// TODO: Implement token retrieval logic
		return this.tokens;
	}

	/**
	 * Gets the entity ID of the portfolio.
	 * @returns The entity ID as a string
	 */
	getEntityId(): string {
		// TODO: Implement entity ID retrieval logic
		return this.entity.getId();
	}

	/**
	 * Gets the entity associated with this portfolio.
	 * @returns The IEntity instance
	 */
	getEntity(): IEntity {
		// TODO: Implement entity retrieval logic
		return this.entity;
	}
}
