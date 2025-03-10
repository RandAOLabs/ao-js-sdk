import { message, createDataItemSigner } from '@permaweb/aoconnect';
import { Tags } from 'src/core/common';
import { ReadOnlyAOClient } from './ReadOnlyAOClient';

export class WriteReadAOClient extends ReadOnlyAOClient {
    private readonly signer: ReturnType<typeof createDataItemSigner>;

    /**
     * Creates a new WriteReadAOClient instance with the provided signer.
     * @param signer - The data item signer used for authenticating messages
     */
    constructor(signer: ReturnType<typeof createDataItemSigner>) {
        super();
        this.signer = signer;
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
