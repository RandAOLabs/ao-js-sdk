import { createDataItemSigner } from '@permaweb/aoconnect';
import { Tags } from '../../../common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { ConnectArgsLegacy } from '../aoconnect-types';
import { AOClientError } from '../AOClientError';
import { AOMessageIdMissingError } from '../../AOError';
import { ReadOnlyRetryAOClient } from './ReadOnlyRetryClient';
import { IWriteReadAOClient } from '../interfaces';
import { WalletUtils } from '../../../common/WalletUtils';
import { SendMessage } from '../../abstract';

export class WriteReadRetryAOClient extends ReadOnlyRetryAOClient implements IWriteReadAOClient {
	private readonly signer: ReturnType<typeof createDataItemSigner>;
	private readonly wallet: JWKInterface | any;
	protected _message!: SendMessage;

	/**
	 * Creates a new WriteReadAOClient instance with the provided signer.
	 * @param signer - The data item signer used for authenticating messages
	 */
	constructor(wallet: JWKInterface | any, aoConfig?: ConnectArgsLegacy) {
		super(aoConfig); // sets the config
		this.wallet = wallet;
		this.signer = createDataItemSigner(wallet);
	}

	public async message(
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


	public async getCallingWalletAddress(): Promise<string> {
		return await WalletUtils.getWalletAddress(this.getWallet())
	}


	public getWallet(): JWKInterface | any | undefined {
		return this.wallet
	}
}
