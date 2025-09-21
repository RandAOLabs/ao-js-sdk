import { staticImplements } from '../../decorators/staticImplements';
import { IByteUtils } from './abstract/IByteUtils';

/**
 * Static utility class for byte manipulation operations.
 * Provides methods for encoding/decoding between different formats.
 */
@staticImplements<IByteUtils>()
export class ByteUtils {
	/**
	 * Converts base64url string to Uint8Array
	 * @param base64url The base64url encoded string
	 * @returns Uint8Array containing the decoded bytes
	 */
	static base64UrlToBytes(base64url: string): Uint8Array {
		// Add padding if needed
		let padded = base64url;
		while (padded.length % 4) {
			padded += '=';
		}

		// Convert base64url to base64
		const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');

		// Convert to bytes
		const binaryString = atob(base64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	/**
	 * Converts Uint8Array to base64url string
	 * @param bytes The bytes to encode
	 * @returns base64url encoded string
	 */
	static bytesToBase64Url(bytes: Uint8Array): string {
		// Convert to binary string
		let binaryString = '';
		for (let i = 0; i < bytes.length; i++) {
			binaryString += String.fromCharCode(bytes[i]);
		}

		// Convert to base64
		const base64 = btoa(binaryString);

		// Convert to base64url (remove padding and replace chars)
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	}

	/**
	 * Converts base64 string to Uint8Array
	 * @param base64 The base64 encoded string
	 * @returns Uint8Array containing the decoded bytes
	 */
	static base64ToBytes(base64: string): Uint8Array {
		const binaryString = atob(base64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	/**
	 * Converts Uint8Array to base64 string
	 * @param bytes The bytes to encode
	 * @returns base64 encoded string
	 */
	static bytesToBase64(bytes: Uint8Array): string {
		let binaryString = '';
		for (let i = 0; i < bytes.length; i++) {
			binaryString += String.fromCharCode(bytes[i]);
		}
		return btoa(binaryString);
	}

	/**
	 * Converts hex string to Uint8Array
	 * @param hex The hex string (with or without 0x prefix)
	 * @returns Uint8Array containing the decoded bytes
	 */
	static hexToBytes(hex: string): Uint8Array {
		// Remove 0x prefix if present
		const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

		// Ensure even length
		const paddedHex = cleanHex.length % 2 ? '0' + cleanHex : cleanHex;

		const bytes = new Uint8Array(paddedHex.length / 2);
		for (let i = 0; i < paddedHex.length; i += 2) {
			bytes[i / 2] = parseInt(paddedHex.substr(i, 2), 16);
		}
		return bytes;
	}

	/**
	 * Converts Uint8Array to hex string
	 * @param bytes The bytes to encode
	 * @param withPrefix Whether to include '0x' prefix
	 * @returns hex encoded string
	 */
	static bytesToHex(bytes: Uint8Array, withPrefix: boolean = false): string {
		const hexCodes = [...bytes].map(value => {
			const hexCode = value.toString(16);
			return hexCode.padStart(2, '0');
		});
		const hex = hexCodes.join('');
		return withPrefix ? '0x' + hex : hex;
	}

	/**
	 * Converts string to Uint8Array using UTF-8 encoding
	 * @param str The string to encode
	 * @returns Uint8Array containing the UTF-8 encoded bytes
	 */
	static stringToBytes(str: string): Uint8Array {
		return new TextEncoder().encode(str);
	}

	/**
	 * Converts Uint8Array to string using UTF-8 decoding
	 * @param bytes The bytes to decode
	 * @returns The decoded string
	 */
	static bytesToString(bytes: Uint8Array): string {
		return new TextDecoder().decode(bytes);
	}

	/**
	 * Concatenates multiple Uint8Arrays into a single Uint8Array
	 * @param arrays The arrays to concatenate
	 * @returns A new Uint8Array containing all the bytes
	 */
	static concatBytes(...arrays: Uint8Array[]): Uint8Array {
		const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const arr of arrays) {
			result.set(arr, offset);
			offset += arr.length;
		}
		return result;
	}

	/**
	 * Compares two Uint8Arrays for equality
	 * @param a First array
	 * @param b Second array
	 * @returns true if arrays are equal, false otherwise
	 */
	static areEqual(a: Uint8Array, b: Uint8Array): boolean {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Creates a copy of a Uint8Array
	 * @param bytes The array to copy
	 * @returns A new Uint8Array with the same contents
	 */
	static copy(bytes: Uint8Array): Uint8Array {
		return new Uint8Array(bytes);
	}
}
