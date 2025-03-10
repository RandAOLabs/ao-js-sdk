import { message, createDataItemSigner } from '@permaweb/aoconnect';
import { Tags } from 'src/core/common';
import { ReadOnlyAOClient } from './ReadOnlyAOClient';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Environment, getEnvironment } from 'src/utils';
import { getArweave } from 'src/core/arweave/arweave';

export class WriteReadAOClient extends ReadOnlyAOClient {
    private readonly signer: ReturnType<typeof createDataItemSigner>;
    private readonly wallet: JWKInterface | any;

    /**
     * Creates a new WriteReadAOClient instance with the provided signer.
     * @param signer - The data item signer used for authenticating messages
     */
    constructor(wallet: JWKInterface | any) {
        super();
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
        return await message({
            process,
            signer: this.signer,
            data,
            tags,
            anchor,
        });
    }
}
