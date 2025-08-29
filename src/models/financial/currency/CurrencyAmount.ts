import { ICurrencyAmount } from './abstract/CurrencyAmount';

/**
 * Concrete implementation of ICurrencyAmount for handling currency amounts with precise decimal arithmetic.
 */
export class CurrencyAmount implements ICurrencyAmount {
	private readonly _amount: bigint;
	private readonly _decimals: number;

	/**
	 * Static field representing a zero currency amount with 0 decimals.
	 */
	static readonly None = new CurrencyAmount(BigInt(0), 0);

	/**
	 * Creates a new CurrencyAmount instance.
	 * @param amount The raw amount as a bigint (in smallest units)
	 * @param decimals The number of decimal places for this currency
	 */
	constructor(amount: bigint, decimals: number) {
		this._amount = amount;
		this._decimals = decimals;
	}

	/**
	 * Creates a CurrencyAmount from a decimal string or number.
	 * @param value The decimal value as a string or number
	 * @param decimals The number of decimal places for this currency
	 * @returns A new CurrencyAmount instance
	 */
	static fromDecimal(value: string | number, _decimals: string | number): CurrencyAmount {
		const decimals = typeof _decimals === 'number' ? _decimals : Number(_decimals);
		const stringValue = typeof value === 'number' ? value.toString() : value;
		const [integerPart, fractionalPart = ''] = stringValue.split('.');

		// Pad or truncate fractional part to match decimals
		const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
		const fullString = integerPart + paddedFractional;

		return new CurrencyAmount(BigInt(fullString), decimals);
	}

	amount(): bigint {
		return this._amount;
	}

	amountString(): string {
		return this._amount.toString();
	}

	decimals(): number {
		return this._decimals;
	}

	toString(): string {
		const divisor = BigInt(10 ** this._decimals);
		const integerPart = this._amount / divisor;
		const fractionalPart = this._amount % divisor;

		if (fractionalPart === BigInt(0)) {
			return integerPart.toString();
		}

		const fractionalString = fractionalPart.toString().padStart(this._decimals, '0');
		// Remove trailing zeros
		const trimmedFractional = fractionalString.replace(/0+$/, '');

		return trimmedFractional.length > 0
			? `${integerPart}.${trimmedFractional}`
			: integerPart.toString();
	}

	toFixed(decimalPlaces: number): string {
		const divisor = BigInt(10 ** this._decimals);
		const integerPart = this._amount / divisor;
		const fractionalPart = this._amount % divisor;

		if (decimalPlaces === 0) {
			return integerPart.toString();
		}

		const fractionalString = fractionalPart.toString().padStart(this._decimals, '0');

		// Adjust fractional part to desired decimal places
		let adjustedFractional: string;
		if (decimalPlaces >= this._decimals) {
			adjustedFractional = fractionalString.padEnd(decimalPlaces, '0');
		} else {
			adjustedFractional = fractionalString.slice(0, decimalPlaces);
		}

		return `${integerPart}.${adjustedFractional}`;
	}

	toAbbreviated(decimalPlaces: number = 1): string {
		const value = this.toNumber();

		const abbreviations = [
			{ threshold: 1e12, suffix: 'T' },
			{ threshold: 1e9, suffix: 'B' },
			{ threshold: 1e6, suffix: 'M' },
			{ threshold: 1e3, suffix: 'K' }
		];

		for (const { threshold, suffix } of abbreviations) {
			if (Math.abs(value) >= threshold) {
				const abbreviated = value / threshold;
				return `${abbreviated.toFixed(decimalPlaces)}${suffix}`;
			}
		}

		return this.toFixed(decimalPlaces);
	}

	/**
	 * Converts the currency amount to a JavaScript number.
	 * Note: This may lose precision for very large amounts.
	 * @returns The amount as a number
	 */
	toNumber(): number {
		const divisor = BigInt(10 ** this._decimals);
		const integerPart = Number(this._amount / divisor);
		const fractionalPart = Number(this._amount % divisor) / (10 ** this._decimals);

		return integerPart + fractionalPart;
	}

	/**
	 * Adds another CurrencyAmount to this one.
	 * Both amounts must have the same number of decimals.
	 * @param other The other CurrencyAmount to add
	 * @returns A new CurrencyAmount with the sum
	 */
	add(other: CurrencyAmount): CurrencyAmount {
		if (this._decimals !== other._decimals) {
			throw new Error('Cannot add currency amounts with different decimal places');
		}

		return new CurrencyAmount(this._amount + other._amount, this._decimals);
	}

	/**
	 * Subtracts another CurrencyAmount from this one.
	 * Both amounts must have the same number of decimals.
	 * @param other The other CurrencyAmount to subtract
	 * @returns A new CurrencyAmount with the difference
	 */
	subtract(other: CurrencyAmount): CurrencyAmount {
		if (this._decimals !== other._decimals) {
			throw new Error('Cannot subtract currency amounts with different decimal places');
		}

		return new CurrencyAmount(this._amount - other._amount, this._decimals);
	}

	/**
	 * Multiplies this CurrencyAmount by a number.
	 * @param multiplier The number to multiply by
	 * @returns A new CurrencyAmount with the product
	 */
	multiply(multiplier: number): CurrencyAmount {
		const multiplierBigInt = BigInt(Math.round(multiplier * (10 ** this._decimals)));
		const result = (this._amount * multiplierBigInt) / BigInt(10 ** this._decimals);

		return new CurrencyAmount(result, this._decimals);
	}

	/**
	 * Divides this CurrencyAmount by a number.
	 * @param divisor The number to divide by
	 * @returns A new CurrencyAmount with the quotient
	 */
	divide(divisor: number): CurrencyAmount {
		if (divisor === 0) {
			throw new Error('Cannot divide by zero');
		}

		const divisorBigInt = BigInt(Math.round(divisor * (10 ** this._decimals)));
		const result = (this._amount * BigInt(10 ** this._decimals)) / divisorBigInt;

		return new CurrencyAmount(result, this._decimals);
	}

	/**
	 * Compares this CurrencyAmount with another.
	 * @param other The other CurrencyAmount to compare
	 * @returns -1 if this < other, 0 if equal, 1 if this > other
	 */
	compare(other: CurrencyAmount): number {
		if (this._decimals !== other._decimals) {
			throw new Error('Cannot compare currency amounts with different decimal places');
		}

		if (this._amount < other._amount) return -1;
		if (this._amount > other._amount) return 1;
		return 0;
	}

	/**
	 * Checks if this CurrencyAmount equals another.
	 * @param other The other CurrencyAmount to compare
	 * @returns True if equal, false otherwise
	 */
	equals(other: CurrencyAmount): boolean {
		return this._decimals === other._decimals && this._amount === other._amount;
	}

	/**
	 * Checks if this CurrencyAmount is greater than another.
	 * @param other The other CurrencyAmount to compare
	 * @returns True if this > other, false otherwise
	 */
	greaterThan(other: CurrencyAmount): boolean {
		return this.compare(other) > 0;
	}

	/**
	 * Checks if this CurrencyAmount is less than another.
	 * @param other The other CurrencyAmount to compare
	 * @returns True if this < other, false otherwise
	 */
	lessThan(other: CurrencyAmount): boolean {
		return this.compare(other) < 0;
	}

	/**
	 * Checks if this CurrencyAmount is zero.
	 * @returns True if the amount is zero, false otherwise
	 */
	isZero(): boolean {
		return this._amount === BigInt(0);
	}

	/**
	 * Checks if this CurrencyAmount is positive.
	 * @returns True if the amount is positive, false otherwise
	 */
	isPositive(): boolean {
		return this._amount > BigInt(0);
	}

	/**
	 * Checks if this CurrencyAmount is negative.
	 * @returns True if the amount is negative, false otherwise
	 */
	isNegative(): boolean {
		return this._amount < BigInt(0);
	}
}
