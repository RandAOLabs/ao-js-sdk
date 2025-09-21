import { IHasher } from './abstract';

/**
 * Browser-based SHA-256 hasher implementation using the Web Crypto API.
 * This implementation is optimized for browser environments and uses async operations.
 */
export class BrowserSha256Hasher implements IHasher {
	/**
	 * Converts input data to ArrayBuffer for crypto operations.
	 */
	private toArrayBuffer(data: string | Uint8Array | ArrayBuffer): ArrayBuffer {
		if (typeof data === 'string') {
			return new TextEncoder().encode(data).buffer;
		}
		if (data instanceof Uint8Array) {
			// Create a new ArrayBuffer to avoid SharedArrayBuffer issues
			const buffer = new ArrayBuffer(data.byteLength);
			new Uint8Array(buffer).set(data);
			return buffer;
		}
		return data;
	}

	/**
	 * Converts ArrayBuffer to hex string.
	 */
	private bufferToHex(buffer: ArrayBuffer): string {
		const byteArray = new Uint8Array(buffer);
		const hexCodes = [...byteArray].map(value => {
			const hexCode = value.toString(16);
			const paddedHexCode = hexCode.padStart(2, '0');
			return paddedHexCode;
		});
		return hexCodes.join('');
	}

	async sha256(data: string | Uint8Array | ArrayBuffer): Promise<string> {
		const buffer = this.toArrayBuffer(data);
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		return this.bufferToHex(hashBuffer);
	}

	async sha256Bytes(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array> {
		const buffer = this.toArrayBuffer(data);
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		return new Uint8Array(hashBuffer);
	}

	sha256Sync(data: string | Uint8Array | ArrayBuffer): string {
		throw new Error('Synchronous hashing is not supported in browser environments. Use sha256() instead.');
	}

	sha256BytesSync(data: string | Uint8Array | ArrayBuffer): Uint8Array {
		throw new Error('Synchronous hashing is not supported in browser environments. Use sha256Bytes() instead.');
	}

	supportsSynchronousHashing(): boolean {
		return false;
	}
}
