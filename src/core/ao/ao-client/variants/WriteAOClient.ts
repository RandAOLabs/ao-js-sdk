import { createDataItemSigner } from '@permaweb/aoconnect';
import { Tags } from '../../../common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Environment, getEnvironment } from '../../../../utils';
import { getArweave } from '../../../arweave/arweave';
import { ConnectArgsLegacy } from '../aoconnect-types';
import { AOClientError } from '../AOClientError';
import { AOMessageIdMissingError } from '../../AOError';
import { ReadOnlyAOClient } from './ReadOnlyAOClient';

export class WriteReadAOClient extends ReadOnlyAOClient {
	private readonly signer: ReturnType<typeof createDataItemSigner>;
	private readonly wallet: JWKInterface | any;

	/**
	 * Creates a new WriteReadAOClient instance with the provided signer.
	 * @param signer - The data item signer used for authenticating messages
	 */
	constructor(wallet: JWKInterface | any, aoConfig?: ConnectArgsLegacy) {
		super(aoConfig); // sets the config
		this.wallet = wallet;
		this.signer = createDataItemSigner(wallet);
	}

	public async getCallingWalletAddress(): Promise<string> {
		const environment = getEnvironment();

		if (environment === Environment.BROWSER) {
			return await this.wallet.getActiveAddress();
		} else {
			const arweave = getArweave();
			return await arweave.wallets.jwkToAddress(this.wallet);
		}
	}

	public override async message(
		process: string,
		data: string = '',
		tags: Tags = [],
		anchor?: string
	): Promise<string> {
		try {
			const messageId = await this._message({
				process,
				signer: this.signer,
				data,
				tags,
				anchor,
			});
			if (!messageId) {
				throw new AOMessageIdMissingError()
			}
			return messageId
		} catch (error: any) {
			throw new AOClientError(this, this.result, { process, data, tags, anchor }, await this.getCallingWalletAddress(), error);
		}
	}


	public override getWallet(): JWKInterface | any | undefined {
		return this.wallet
	}
}
