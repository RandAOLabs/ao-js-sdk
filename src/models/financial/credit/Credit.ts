import { ICredit } from './abstract/ICredit';
import { TokenBalance } from '../token-balance/TokenBalance';
import { CreditNotice } from '../../../services/credit-notices/abstract/types';
import { TokenConfig } from '../token-balance/abstract/types';

/**
 * Constructor parameters for Credit class.
 */
export interface CreditConstructorParams {
	tokenBalance: TokenBalance;
	transactionDate: Date;
	accountCredited: string;
	accountDebited: string;
	id: string;
	fromProcess: string;
}

/**
 * Concrete implementation of ICredit for managing financial credit transactions.
 */
export class Credit implements ICredit {
	private readonly tokenBalance: TokenBalance;
	private readonly transactionDate: Date;
	private readonly accountCredited: string;
	private readonly accountDebited: string;
	private readonly id: string;
	private readonly fromProcess: string;

	/**
	 * Creates a Credit from a credit notice and token configuration
	 * @param creditNotice The credit notice containing transaction information
	 * @param tokenConfig The token configuration for the credit
	 * @returns A new Credit instance
	 */
	public static fromCreditNotice(creditNotice: CreditNotice, tokenConfig: TokenConfig): Credit {
		// Create TokenBalance from the credit notice
		const tokenBalance = TokenBalance.fromCreditNotice(creditNotice, tokenConfig);

		// Convert timestamp to Date (blockTimeStamp is in seconds, multiply by 1000 for milliseconds)
		const transactionDate = creditNotice.blockTimeStamp
			? new Date(creditNotice.blockTimeStamp * 1000)
			: new Date(); // Fallback to current date if timestamp is undefined

		return new Credit({
			tokenBalance,
			transactionDate,
			accountCredited: creditNotice.recipient,
			accountDebited: creditNotice.sender,
			id: creditNotice.id,
			fromProcess: creditNotice.fromProcess
		});
	}

	/**
	 * Creates a new Credit instance.
	 * @param params Constructor parameters containing all credit information
	 */
	constructor({
		tokenBalance,
		transactionDate,
		accountCredited,
		accountDebited,
		id,
		fromProcess
	}: CreditConstructorParams) {
		this.tokenBalance = tokenBalance;
		this.transactionDate = transactionDate;
		this.accountCredited = accountCredited;
		this.accountDebited = accountDebited;
		this.id = id;
		this.fromProcess = fromProcess;
	}

	/**
	 * Gets the token balance associated with this credit
	 * @returns The TokenBalance representing the credited amount
	 */
	getTokenBalance(): TokenBalance {
		return this.tokenBalance;
	}

	/**
	 * Gets the transaction date when the credit occurred
	 * @returns The date of the credit transaction
	 */
	getTransactionDate(): Date {
		return this.transactionDate;
	}

	/**
	 * Gets the account that was credited
	 * @returns The address/ID of the credited account
	 */
	getAccountCredited(): string {
		return this.accountCredited;
	}

	/**
	 * Gets the account that was debited
	 * @returns The address/ID of the debited account
	 */
	getAccountDebited(): string {
		return this.accountDebited;
	}

	/**
	 * Gets the unique identifier for this credit
	 * @returns The credit ID
	 */
	getId(): string {
		return this.id;
	}

	/**
	 * Gets the process ID that originated this credit
	 * @returns The process ID
	 */
	getFromProcess(): string {
		return this.fromProcess;
	}

	/**
	 * Returns a string representation of the credit
	 * @returns A formatted string containing credit details
	 */
	toString(): string {
		return `Credit: ${this.id} | From: ${this.accountDebited} | To: ${this.accountCredited} | Amount: ${this.tokenBalance.toString()} | Date: ${this.transactionDate.toISOString()} | Process: ${this.fromProcess}`;
	}
}
