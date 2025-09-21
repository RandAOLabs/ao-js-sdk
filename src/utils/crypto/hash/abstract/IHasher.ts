/**
 * Abstract interface for hashing functionality.
 * Provides a unified API for different hashing implementations across browser and Node.js environments.
 * Supports both synchronous and asynchronous operations depending on the environment capabilities.
 */
export interface IHasher {
	/* Asynchronous Methods */
	/**
	 * Computes the SHA-256 hash of the input data asynchronously.
	 *
	 * @param data - The input data to hash (string, Uint8Array, or ArrayBuffer)
	 * @returns Promise resolving to the hash as a hex string
	 */
	sha256(data: string | Uint8Array | ArrayBuffer): Promise<string>;

	/**
	 * Computes the SHA-256 hash of the input data asynchronously and returns it as Uint8Array.
	 *
	 * @param data - The input data to hash (string, Uint8Array, or ArrayBuffer)
	 * @returns Promise resolving to the hash as Uint8Array
	 */
	sha256Bytes(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array>;

	/* Synchronous Methods */
	/**
	 * Computes the SHA-256 hash of the input data synchronously.
	 * Note: May not be available in all environments (e.g., browser environments typically require async).
	 *
	 * @param data - The input data to hash (string, Uint8Array, or ArrayBuffer)
	 * @returns The hash as a hex string
	 * @throws Error if synchronous hashing is not supported in the current environment
	 */
	sha256Sync(data: string | Uint8Array | ArrayBuffer): string;

	/**
	 * Computes the SHA-256 hash of the input data synchronously and returns it as Uint8Array.
	 * Note: May not be available in all environments (e.g., browser environments typically require async).
	 *
	 * @param data - The input data to hash (string, Uint8Array, or ArrayBuffer)
	 * @returns The hash as Uint8Array
	 * @throws Error if synchronous hashing is not supported in the current environment
	 */
	sha256BytesSync(data: string | Uint8Array | ArrayBuffer): Uint8Array;

	/* Capability Methods */
	/**
	 * Indicates whether synchronous hashing operations are supported in the current environment.
	 *
	 * @returns true if sync methods are available, false otherwise
	 */
	supportsSynchronousHashing(): boolean;
}
