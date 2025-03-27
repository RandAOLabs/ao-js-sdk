import { createDataItemSigner, connect } from '@permaweb/aoconnect';
import { Tags } from 'src/core/common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Environment, getEnvironment, Logger } from 'src/utils';
import { getArweave } from 'src/core/arweave/arweave';
import { ConnectArgsLegacy } from 'src/core/ao/ao-client/aoconnect-types';
import { ReadOnlyRetryAOClient } from 'src/core/ao/ao-client/ReadOnlyRetryClient';
import { SendMessage } from '@permaweb/aoconnect/dist/lib/message';
import { AOClientError } from 'src/core/ao/ao-client/AOClientError';

export class WriteReadAOClient extends ReadOnlyRetryAOClient {
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
            const result = await this._message({
                process,
                signer: this.signer,
                data,
                tags,
                anchor,
            });
            return result
        } catch (error: any) {
            throw new AOClientError(this, this.result, { process, data, tags, anchor }, await this.getCallingWalletAddress(), error);
        }
    }

    public override setConfig(aoConnectConfig: ConnectArgsLegacy): void {
        Logger.debug(`Connecting to AO with:`, aoConnectConfig)
        const { message, result, results, dryrun } = connect(aoConnectConfig);
        this._message = message;
        this._result = result;
        this._results = results;
        this._dryrun = dryrun;
    }
}
