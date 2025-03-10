import { result, results, dryrun } from '@permaweb/aoconnect';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { Tags } from 'src/core/common';
import { SortOrder } from 'src/core/ao/abstract';
import { IAOClient } from './abstract/IAOClient';
import { AOReadOnlyClientError } from './AOReadOnlyClientError';

export class ReadOnlyAOClient implements IAOClient {
    public async message(
        process: string,
        data: string = '',
        tags: Tags = [],
        anchor?: string
    ): Promise<string> {
        throw new AOReadOnlyClientError();
    }

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

    public async result(
        process: string,
        messageId: string
    ): Promise<MessageResult> {
        return await result({
            process,
            message: messageId,
        });
    }

    public async dryrun(
        process: string,
        data: any = '',
        tags: Tags = [],
        anchor?: string,
        id?: string,
        owner?: string
    ): Promise<DryRunResult> {
        const result = await dryrun({
            process,
            data,
            tags,
            anchor,
            id,
            owner,
        });
        return result;
    }

    public async getCallingWalletAddress(): Promise<string> {
        throw new AOReadOnlyClientError();
    }
}
