/**
 * Seeded Random Number Generator using secure cryptographic hash functions
 * Compatible with both browser and Node.js environments
 */
export class SeededRandom {
	private seed: string;
	private counter: number;

	constructor(seed: string) {
		this.seed = seed;
		this.counter = 0;
	}

	/**
	 * Generates a secure hash using available crypto APIs
	 * @param input The input string to hash
	 * @returns Promise<ArrayBuffer> The hash result
	 */
	private async generateHash(input: string): Promise<ArrayBuffer> {
		const encoder = new TextEncoder();
		const data = encoder.encode(input);

		// Try Web Crypto API first (available in modern browsers and Node.js 16+)
		if (typeof crypto !== 'undefined' && crypto.subtle) {
			return await crypto.subtle.digest('SHA-256', data);
		}

		// Fallback for Node.js environments without Web Crypto API
		if (typeof require !== 'undefined') {
			try {
				const { createHash } = require('crypto');
				const hash = createHash('sha256');
				hash.update(input);
				const hexString = hash.digest('hex');

				// Convert hex string to ArrayBuffer
				const buffer = new ArrayBuffer(hexString.length / 2);
				const view = new Uint8Array(buffer);
				for (let i = 0; i < hexString.length; i += 2) {
					view[i / 2] = parseInt(hexString.substr(i, 2), 16);
				}
				return buffer;
			} catch (error) {
				// If Node.js crypto is not available, fall back to simple hash
				return this.simpleHash(input);
			}
		}

		// Final fallback for environments without crypto support
		return this.simpleHash(input);
	}

	/**
	 * Simple hash function fallback for environments without crypto support
	 * @param input The input string to hash
	 * @returns ArrayBuffer containing the hash
	 */
	private simpleHash(input: string): ArrayBuffer {
		let hash = 0;
		for (let i = 0; i < input.length; i++) {
			const char = input.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}

		// Convert to ArrayBuffer
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setUint32(0, Math.abs(hash), false);
		return buffer;
	}

	/**
	 * Generates the next random number in the sequence
	 * @returns Promise<number> A random number between 0 and 1
	 */
	public async nextFloat(): Promise<number> {
		const input = `${this.seed}-${this.counter++}`;
		const hashBuffer = await this.generateHash(input);
		const hashArray = new Uint8Array(hashBuffer);

		// Use the first 4 bytes to create a number
		let result = 0;
		for (let i = 0; i < Math.min(4, hashArray.length); i++) {
			result = (result << 8) + hashArray[i];
		}

		// Normalize to 0-1 range
		return (result >>> 0) / 0xFFFFFFFF;
	}

	/**
	 * Generates a random integer between min (inclusive) and max (exclusive)
	 * @param min The minimum value (inclusive)
	 * @param max The maximum value (exclusive)
	 * @returns Promise<number> A random integer in the specified range
	 */
	public async nextInt(min: number, max: number): Promise<number> {
		const float = await this.nextFloat();
		return Math.floor(float * (max - min)) + min;
	}

	/**
	 * Selects a random element from an array
	 * @param array The array to select from
	 * @returns Promise<T> A randomly selected element
	 */
	public async selectRandom<T>(array: T[]): Promise<T> {
		if (array.length === 0) {
			throw new Error('Cannot select from empty array');
		}

		const index = await this.nextInt(0, array.length);
		return array[index];
	}

	/**
	 * Resets the counter, allowing the sequence to be reproduced
	 */
	public reset(): void {
		this.counter = 0;
	}
}

/**
 * Creates a new SeededRandom instance
 * @param seed The seed string for the random number generator
 * @returns SeededRandom instance
 */
export function createSeededRandom(seed: string): SeededRandom {
	return new SeededRandom(seed);
}
