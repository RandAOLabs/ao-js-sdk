/**
 * Interface for static byte manipulation utilities.
 * Defines methods for encoding/decoding between different formats.
 */
export interface IByteUtils {
	/**
	 * Converts base64url string to Uint8Array
	 */
	base64UrlToBytes(base64url: string): Uint8Array;

	/**
	 * Converts Uint8Array to base64url string
	 */
	bytesToBase64Url(bytes: Uint8Array): string;

	/**
	 * Converts base64 string to Uint8Array
	 */
	base64ToBytes(base64: string): Uint8Array;

	/**
	 * Converts Uint8Array to base64 string
	 */
	bytesToBase64(bytes: Uint8Array): string;

	/**
	 * Converts hex string to Uint8Array
	 */
	hexToBytes(hex: string): Uint8Array;

	/**
	 * Converts Uint8Array to hex string
	 */
	bytesToHex(bytes: Uint8Array, withPrefix?: boolean): string;

	/**
	 * Converts string to Uint8Array using UTF-8 encoding
	 */
	stringToBytes(str: string): Uint8Array;

	/**
	 * Converts Uint8Array to string using UTF-8 decoding
	 */
	bytesToString(bytes: Uint8Array): string;

	/**
	 * Concatenates multiple Uint8Arrays into a single Uint8Array
	 */
	concatBytes(...arrays: Uint8Array[]): Uint8Array;

	/**
	 * Compares two Uint8Arrays for equality
	 */
	areEqual(a: Uint8Array, b: Uint8Array): boolean;

	/**
	 * Creates a copy of a Uint8Array
	 */
	copy(bytes: Uint8Array): Uint8Array;
}
