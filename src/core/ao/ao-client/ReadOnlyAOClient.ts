import { result, results, dryrun, connect } from '@permaweb/aoconnect';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { Tags } from 'src/core/common';
import { SortOrder } from 'src/core/ao/abstract';
import { IAOClient } from './abstract/IAOClient';
import { AOReadOnlyClientError } from './AOReadOnlyClientError';
import { ConnectArgsLegacy, ConnectArgsMainnet, ConnectArgsMainnetFull } from 'src/core/ao/ao-client/aoconnect-types';
import { AOSuspectedRateLimitingError } from 'src/core/ao/ao-client/AOError';

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
        let result;
        try {
            result = await dryrun({
                process,
                data,
                tags,
                anchor,
                id,
                owner,
            });
        } catch (error: any) {
            if (error.message = `Unexpected token '<', \"<html>\r\n<h\"... is not valid JSON`) {
                throw new AOSuspectedRateLimitingError(error, { process, data, tags, anchor, id, owner })
            } else {
                throw error
            }
        }
        return result;
    }

    public async getCallingWalletAddress(): Promise<string> {
        throw new AOReadOnlyClientError();
    }

    public setConfig(aoConnectConfig: ConnectArgsLegacy) {
        connect(aoConnectConfig)
    }
}
