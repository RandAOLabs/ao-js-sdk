import { message, result, results, createDataItemSigner, dryrun } from '@permaweb/aoconnect';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { Tags } from 'src/core/common';
import { SortOrder } from 'src/core/ao/abstract';

/**
 * AO class provides a wrapper for interacting with the Arweave Operating System (AO).
 * This class encapsulates all core AO functionality from @permaweb/aoconnect, providing
 * a clean interface for sending messages, retrieving results, and performing dry runs.
 * 
 * The class maintains a signer instance for message authentication and requires a process ID
 * for each operation to identify the target AO process.
 */
export class AO {
    private readonly signer: ReturnType<typeof createDataItemSigner>;
    /**
     * Creates a new AO instance with the provided signer.
     * @param signer - The data item signer used for authenticating messages
     */
    constructor(signer: ReturnType<typeof createDataItemSigner>) {
        this.signer = signer;
    }

    /**
     * Sends a message to an AO process.
     * @param process - The target process ID
     * @param data - The message data to send
     * @param tags - Optional tags to attach to the message
     * @param anchor - Optional anchor reference
     * @returns Promise resolving to the message ID
     */
    public async message(
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

    /**
     * Retrieves results from an AO process.
     * @param process - The target process ID
     * @param from - Optional starting point for results
     * @param to - Optional ending point for results
     * @param limit - Maximum number of results to return (default: 25)
     * @param sort - Sort order for results (default: ASCENDING)
     * @returns Promise resolving to the results response
     */
    public async results(
        process: string,
        from?: string,
        to?: string,
        limit: number = 25,
        sort: SortOrder = SortOrder.ASCENDING
    ): Promise<ResultsResponse> {
        return await results({
            process,
            from,
            to,
            limit,
            sort,
        });
    }

    /**
     * Retrieves the result of a specific message.
     * @param process - The target process ID
     * @param messageId - The ID of the message to get results for
     * @returns Promise resolving to the message result
     */
    public async result(
        process: string,
        messageId: string
    ): Promise<MessageResult> {
        return await result({
            process,
            message: messageId,
        });
    }

    /**
     * Performs a dry run of a message without actually sending it.
     * @param process - The target process ID
     * @param data - The message data to simulate
     * @param tags - Optional tags to include
     * @param anchor - Optional anchor reference
     * @param id - Optional message ID
     * @param owner - Optional owner address
     * @returns Promise resolving to the dry run result
     */
    public async dryrun(
        process: string,
        data: any = '',
        tags: Tags = [],
        anchor?: string,
        id?: string,
        owner?: string
    ): Promise<DryRunResult> {
        return await dryrun({
            process,
            data,
            tags,
            anchor,
            id,
            owner,
        });
    }
}
