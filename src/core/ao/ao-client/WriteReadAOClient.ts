import { message, createDataItemSigner, connect } from '@permaweb/aoconnect';
import { Tags } from 'src/core/common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Environment, getEnvironment } from 'src/utils';
import { getArweave } from 'src/core/arweave/arweave';
import { ConnectArgsLegacy } from 'src/core/ao/ao-client/aoconnect-types';
import { ReadOnlyRetryAOClient } from 'src/core/ao/ao-client/ReadOnlyRetryClient';

export class WriteReadAOClient extends ReadOnlyRetryAOClient {
    private readonly signer: ReturnType<typeof createDataItemSigner>;
    private readonly wallet: JWKInterface | any;
    protected _message!: typeof message;

    /**
     * Creates a new WriteReadAOClient instance with the provided signer.
     * @param signer - The data item signer used for authenticating messages
     */
    constructor(wallet: JWKInterface | any) {
        super(); // sets the config
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
        return await this._message({
            process,
            signer: this.signer,
            data,
            tags,
            anchor,
        });
    }

    public override setConfig(aoConnectConfig: ConnectArgsLegacy): void {
        const { message, result, results, dryrun } = connect(aoConnectConfig);
        this._message = message;
        this._result = result;
        this._results = results;
        this._dryrun = dryrun;
    }
}
