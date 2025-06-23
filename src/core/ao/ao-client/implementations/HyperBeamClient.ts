import { connect } from '@permaweb/aoconnect';
import { MessageResult, ReadResult, ReadResultArgs } from '@permaweb/aoconnect/dist/lib/result';
import { ReadResults, ReadResultsArgs, ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRun, DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';

import { Logger } from '../../../../utils';
import { SortOrder } from '../../abstract';
import { DryRunParams } from '../interfaces';
import { AORateLimitingError, AOClientError } from '../AOClientError';
import { ConnectArgsLegacy, ConnectArgsMainnetFull } from '../aoconnect-types';
import { AO_CONFIGURATION_DEFAULT } from '../configurations';
import { RATELIMIT_ERROR_TEXT } from '../constants';
import { SendMessage } from '@permaweb/aoconnect/dist/lib/message';
import { IReadOnlyAOClient } from '../interfaces/IReadOnlyAOClient';

/**
 * @deprecated soon
 */
export class ReadOnlyLegacyAOClient implements IReadOnlyAOClient {
	protected _result!: ReadResult;
	protected _results!: ReadResults;
	protected _dryrun!: DryRun;
	protected _message!: SendMessage; // Technically only needed for Writing clients should not be used in this file

	protected activeAOConfig!: ConnectArgsLegacy;

	constructor(aoConfig?: ConnectArgsLegacy) {
		if (aoConfig) {
			this.setConfig(aoConfig);
		} else {
			this.setConfig(AO_CONFIGURATION_DEFAULT);
		}
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
				throw new AORateLimitingError(this, this.dryrun, params, undefined, error)
			} else {
				throw new AOClientError(this, this.results, params, undefined, error);
			}
		}

	}

	public async result(params: ReadResultArgs): Promise<MessageResult> {
		try {
			const result = await this._result(params);
			return result
		} catch (error: any) {
			if (error.message = RATELIMIT_ERROR_TEXT) {
				throw new AORateLimitingError(this, this.dryrun, params, undefined, error)
			} else {
				throw new AOClientError(this, this.result, params, undefined, error);
			}
		}

	}

	public async dryrun(params: DryRunParams): Promise<DryRunResult> {
		throw new Error("No dryruns on HyperBeam Silly")
	}


	public setConfig(aoConnectConfig: ConnectArgsMainnetFull): void {
		Logger.debug(`Connecting to AO with:`, aoConnectConfig)
		const { message, result, results, request } = connect(aoConnectConfig);
		this._message = message;
		this._result = result;
		this._results = results;
		this._dryrun = dryrun;
	}

	public getActiveConfig(): ConnectArgsMainnetFull {
		return this.activeAOConfig
	}
}
