import { IHasher } from './abstract';
import { BrowserSha256Hasher } from './BrowserSha256Hasher';
import { NodeSha256Hasher } from './NodeSha256Hasher';
import { IAutoconfiguration } from '../../class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../decorators/staticImplements';
import { getEnvironment, Environment } from '../../environment';

/**
 * Environment-aware SHA-256 hasher that automatically detects the runtime environment
 * and uses the appropriate implementation (Node.js or Browser).
 * Implements IAutoconfiguration for easy instantiation.
 */
@staticImplements<IAutoconfiguration>()
export class EnvironmentSha256Hasher implements IHasher {
	private hasher: IHasher;

	constructor(hasher?: IHasher) {
		this.hasher = hasher || EnvironmentSha256Hasher.detectEnvironmentHasher();
	}

	/**
	 * Creates a pre-configured instance that automatically detects the environment.
	 * This is the recommended way to instantiate this class for most use cases.
	 * @returns A pre-configured EnvironmentSha256Hasher instance.
	 */
	static autoConfiguration(): IHasher {
		return new EnvironmentSha256Hasher();
	}

	/**
	 * Detects the current runtime environment and returns the appropriate hasher.
	 */
	private static detectEnvironmentHasher(): IHasher {
		try {
			const environment = getEnvironment();

			switch (environment) {
				case Environment.NODE:
					return new NodeSha256Hasher();
				case Environment.BROWSER:
					return new BrowserSha256Hasher();
				default:
					// Fallback to browser hasher as default
					return new BrowserSha256Hasher();
			}
		} catch (error) {
			// If environment detection fails, fallback to browser hasher
			return new BrowserSha256Hasher();
		}
	}

	async sha256(data: string | Uint8Array | ArrayBuffer): Promise<string> {
		return this.hasher.sha256(data);
	}

	async sha256Bytes(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array> {
		return this.hasher.sha256Bytes(data);
	}

	sha256Sync(data: string | Uint8Array | ArrayBuffer): string {
		return this.hasher.sha256Sync(data);
	}

	sha256BytesSync(data: string | Uint8Array | ArrayBuffer): Uint8Array {
		return this.hasher.sha256BytesSync(data);
	}

	supportsSynchronousHashing(): boolean {
		return this.hasher.supportsSynchronousHashing();
	}

	/**
	 * Gets the underlying hasher implementation being used.
	 * @returns The current IHasher implementation
	 */
	getHasher(): IHasher {
		return this.hasher;
	}

	/**
	 * Gets the name of the underlying hasher implementation.
	 * @returns The class name of the current hasher
	 */
	getHasherType(): string {
		return this.hasher.constructor.name;
	}

	/**
	 * Gets the detected environment.
	 * @returns The current environment (NODE or BROWSER)
	 */
	getEnvironment(): Environment {
		return getEnvironment();
	}
}
