import { connect } from '@permaweb/aoconnect';
import { JWKInterface } from 'arweave/node/lib/wallet';

import { Logger } from '../../../../utils';
import { DryRun, DryRunResult, MessageResult, ReadResult, ReadResultArgs, ReadResults, ReadResultsArgs, ResultsResponse, SendMessage, SortOrder } from '../../abstract';
import { DryRunParams } from '../interfaces';
import { AORateLimitingError, AOClientError } from '../AOClientError';
import { ConnectArgsLegacy } from '../aoconnect-types';
import { AO_CONFIGURATION_DEFAULT } from '../configurations';
import { RATELIMIT_ERROR_TEXT } from '../constants';
import { IAOClient } from '../interfaces/IAOClient';
import { Tags } from '../../../common';

export class ReadOnlyAOClient implements IAOClient {
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
				throw new AORateLimitingError(this, this.results, params, undefined, error)
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
				throw new AORateLimitingError(this, this.result, params, await this.getCallingWalletAddress(), error)
			} else {
				throw new AOClientError(this, this.result, params, await this.getCallingWalletAddress(), error);
			}
		}

	}

	public async dryrun(params: DryRunParams): Promise<DryRunResult> {
		try {
			Logger.debug(params)
			const result = await this._dryrun(params);
			Logger.debug("---------------------")
			Logger.debug(result)
			return result
		} catch (error: any) {
			if (error.message = RATELIMIT_ERROR_TEXT) {
				throw new AORateLimitingError(this, this.dryrun, params, await this.getCallingWalletAddress(), error)
			} else {
				throw new AOClientError(this, this.dryrun, params, await this.getCallingWalletAddress(), error);
			}
		}
	}


	public setConfig(aoConnectConfig: ConnectArgsLegacy): void {
		Logger.debug(`Connecting to AO with:`, aoConnectConfig)
		const { message, result, results, dryrun } = connect(aoConnectConfig);
		this._message = message;
		this._result = result;
		this._results = results;
		this._dryrun = dryrun;
	}

	public getActiveConfig(): ConnectArgsLegacy {
		return this.activeAOConfig
	}

	public async message(
		process: string,
		data?: string,
		tags?: Tags,
		anchor?: string
	): Promise<string> {
		throw new Error('ReadOnlyAOClient does not support message sending. Use WriteReadAOClient for write operations.');
	}

	public async getCallingWalletAddress(): Promise<string> {
		return "ReadOnlyAOClient does not have an associated wallet.";
	}

	public getWallet(): JWKInterface | any | undefined {
		return undefined;
	}

	public isReadOnly(): boolean {
		return true;
	}
}
