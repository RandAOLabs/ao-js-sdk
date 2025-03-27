import { connect } from '@permaweb/aoconnect';
import { MessageResult, ReadResult, ReadResultArgs } from '@permaweb/aoconnect/dist/lib/result';
import { ReadResults, ReadResultsArgs, ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRun, DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { Tags } from 'src/core/common';
import { DryRunParams } from './abstract';
import { IAOClient } from './abstract/IAOClient';
import { ConnectArgsLegacy } from './aoconnect-types';
import { AO_CONFIGURATION_DEFAULT } from 'src/core/ao/ao-client/configurations';
import { AOClientError, AOReadOnlyClientError, AORateLimitingError } from 'src/core/ao/ao-client/AOClientError';
import { SortOrder } from 'src/core/ao/abstract';
import { Logger } from 'src/utils';
import { RATELIMIT_ERROR_TEXT } from 'src/core/ao/ao-client/constants';

export class ReadOnlyAOClient implements IAOClient {
    protected _result!: ReadResult;
    protected _results!: ReadResults;
    protected _dryrun!: DryRun;
    protected activeAOConfig!: ConnectArgsLegacy;

    constructor(aoConfig?: ConnectArgsLegacy) {
        if (aoConfig) {
            this.setConfig(aoConfig);
        } else {
            this.setConfig(AO_CONFIGURATION_DEFAULT);
        }
    }

    public async message(
        process: string,
        data: string = '',
        tags: Tags = [],
        anchor?: string
    ): Promise<string> {
        throw new AOReadOnlyClientError(this, this.message, { process, data, tags, anchor });
    }

    public async results(
        params: ReadResultsArgs
    ): Promise<ResultsResponse> {
        try {
            if (!params.limit) {
                params.limit = 25
            }
            if (!params.sort) {
                params.sort = SortOrder.ASCENDING
            }
            const results = await this._results(params);
            return results
        } catch (error: any) {
            if (error.message = RATELIMIT_ERROR_TEXT) {
                throw new AORateLimitingError(this, this.dryrun, params, await this.getCallingWalletAddress(), error)
            } else {
                throw new AOClientError(this, this.results, params, await this.getCallingWalletAddress(), error);
            }
        }

    }

    public async result(params: ReadResultArgs): Promise<MessageResult> {
        try {
            const result = await this._result(params);
            return result
        } catch (error: any) {
            if (error.message = RATELIMIT_ERROR_TEXT) {
                throw new AORateLimitingError(this, this.dryrun, params, await this.getCallingWalletAddress(), error)
            } else {
                throw new AOClientError(this, this.result, params, await this.getCallingWalletAddress(), error);
            }
        }

    }

    public async dryrun(params: DryRunParams): Promise<DryRunResult> {
        try {
            const result = await this._dryrun(params);
            return result
        } catch (error: any) {
            if (error.message = RATELIMIT_ERROR_TEXT) {
                throw new AORateLimitingError(this, this.dryrun, params, await this.getCallingWalletAddress(), error)
            } else {
                throw new AOClientError(this, this.dryrun, params, await this.getCallingWalletAddress(), error);
            }
        }
    }

    public async getCallingWalletAddress(): Promise<string> {
        throw new AOReadOnlyClientError(this, this.message, undefined);
    }

    public setConfig(aoConnectConfig: ConnectArgsLegacy) {
        Logger.debug(`Connecting to AO with:`, aoConnectConfig)
        const { result, results, dryrun } = connect(aoConnectConfig);
        this._result = result;
        this._results = results;
        this._dryrun = dryrun;
    }

    public getActiveConfig(): ConnectArgsLegacy {
        return this.activeAOConfig
    }
}
