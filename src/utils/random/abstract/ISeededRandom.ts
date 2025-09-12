/**
 * Interface for seeded random number generators
 */
export interface ISeededRandom {
	/**
	 * Generates the next random number in the sequence
	 * @returns Promise<number> A random number between 0 and 1
	 */
	nextFloat(): Promise<number>;

	/**
	 * Generates a random integer between min (inclusive) and max (exclusive)
	 * @param min The minimum value (inclusive)
	 * @param max The maximum value (exclusive)
	 * @returns Promise<number> A random integer in the specified range
	 */
	nextInt(min: number, max: number): Promise<number>;

	/**
	 * Selects a random element from an array
	 * @param array The array to select from
	 * @returns Promise<T> A randomly selected element
	 */
	selectRandom<T>(array: T[]): Promise<T>;

	/**
	 * Resets the counter, allowing the sequence to be reproduced
	 */
	reset(): void;
}
