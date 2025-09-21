import { createHash } from 'crypto';
import { IHasher } from './abstract';

/**
 * Node.js-based SHA-256 hasher implementation using the built-in crypto module.
 * This implementation supports both synchronous and asynchronous operations.
 */
export class NodeSha256Hasher implements IHasher {
	/**
	 * Converts input data to Buffer for crypto operations.
	 */
	private toBuffer(data: string | Uint8Array | ArrayBuffer): Buffer {
		if (typeof data === 'string') {
			return Buffer.from(data, 'utf8');
		}
		if (data instanceof Uint8Array) {
			return Buffer.from(data);
		}
		return Buffer.from(data);
	}

	async sha256(data: string | Uint8Array | ArrayBuffer): Promise<string> {
		return this.sha256Sync(data);
	}

	async sha256Bytes(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array> {
		return this.sha256BytesSync(data);
	}

	sha256Sync(data: string | Uint8Array | ArrayBuffer): string {
		const buffer = this.toBuffer(data);
		const hash = createHash('sha256');
		hash.update(buffer);
		return hash.digest('hex');
	}

	sha256BytesSync(data: string | Uint8Array | ArrayBuffer): Uint8Array {
		const buffer = this.toBuffer(data);
		const hash = createHash('sha256');
		hash.update(buffer);
		const digest = hash.digest();
		return new Uint8Array(digest);
	}

	supportsSynchronousHashing(): boolean {
		return true;
	}
}
