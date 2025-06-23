import { JWKInterface } from "arweave/node/lib/wallet";
import { IBuilder } from "../../../utils";
import { ConnectArgsLegacy } from "./aoconnect-types";
import { IReadOnlyAOClient } from "./interfaces/IReadOnlyAOClient";
import { ReadOnlyLegacyAOClient, ReadOnlyRetryAOClient, WriteReadAOClient, WriteReadRetryAOClient } from "./implementations";
import { IWriteReadAOClient } from "./interfaces";

export class AOClientBuilder implements IBuilder<IReadOnlyAOClient | IWriteReadAOClient> {
	private wallet: JWKInterface | any | undefined;
	private aoConfig: ConnectArgsLegacy | undefined;
	private retriesEnabled: boolean = false;

	build(): IReadOnlyAOClient | IWriteReadAOClient {
		if (this.wallet) {
			// If wallet is provided, return write-read client
			return this.retriesEnabled
				? new WriteReadRetryAOClient(this.wallet, this.aoConfig)
				: new WriteReadAOClient(this.wallet, this.aoConfig);
		}
		// Otherwise return read-only client
		return this.retriesEnabled
			? new ReadOnlyRetryAOClient(this.aoConfig)
			: new ReadOnlyLegacyAOClient(this.aoConfig);
	}

	reset(): this {
		this.aoConfig = undefined;
		this.retriesEnabled = false;
		this.wallet = undefined;
		return this;
	}

	allowDefaults(allow: boolean): this {
		return this;
	}

	withWallet(wallet: JWKInterface | any | undefined): this {
		this.wallet = wallet;
		return this;
	}

	withAOConfig(aoConfig: ConnectArgsLegacy | undefined): this {
		this.aoConfig = aoConfig;
		return this;
	}

	/**
	 * Sets the retries enabled to a specific value, defaults to false.
	 * @param enabled whether or not to retry on rpc errors.
	 * @returns The builder instance for method chaining
	 */
	withRetriesEnabled(enabled: boolean | undefined = false): this {
		this.retriesEnabled = enabled;
		return this;
	}

}
