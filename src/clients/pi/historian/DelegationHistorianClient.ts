import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { BaseClient } from '../../../core/ao/BaseClient';
import { BaseClientConfig } from '../../../core/ao/configuration/BaseClientConfig';
import { ClientError } from '../../common/ClientError';
import { DelegationRecord, IDelegationHistorianClient, ProjectDelegationTotal } from './IDelegationHistorianClient';
import {
  ACTION_GET_TOTAL_DELEGATED_AO_BY_PROJECT,
  ACTION_GET_LAST_RECORD,
  ACTION_GET_LAST_N_RECORDS,
  DELEGATION_HISTORIAN_PROCESS_ID
} from './constants';

export class DelegationHistorianClient extends BaseClient implements IDelegationHistorianClient {
  private static DEFAULT_PROCESS_ID = DELEGATION_HISTORIAN_PROCESS_ID;

  constructor(baseConfig: BaseClientConfig) {
    super(baseConfig);
  }

  /**
   * Fetches the total delegated AO by project
   * @returns Array of project delegation totals
   */
  public async getTotalDelegatedAOByProject(): Promise<ProjectDelegationTotal[]> {
    try {
      const response = await this.dryrun('', [
        { name: 'Action', value: ACTION_GET_TOTAL_DELEGATED_AO_BY_PROJECT }
      ]);
      
      if (!response?.Messages?.length) {
        throw new Error('No data returned from Get-Total-Delegated-AO-By-Project');
      }
      
      const data = JSON.parse(response.Messages[0].Data);
      return Object.entries(data).map(([projectId, amount]) => ({
        projectId,
        amount: amount as string
      }));
    } catch (error: any) {
      throw new ClientError(this, this.getTotalDelegatedAOByProject, {}, error);
    }
  }

  /**
   * Fetches the last record of delegations
   * @returns The last delegation record
   */
  public async getLastRecord(): Promise<DelegationRecord> {
    try {
      const response = await this.dryrun('', [
        { name: 'Action', value: ACTION_GET_LAST_RECORD }
      ]);
      
      if (!response?.Messages?.length) {
        throw new Error('No data returned from Get-Last-Record');
      }
      
      return JSON.parse(response.Messages[0].Data) as DelegationRecord;
    } catch (error: any) {
      throw new ClientError(this, this.getLastRecord, {}, error);
    }
  }

  /**
   * Fetches the last N records of delegations
   * @param count Number of records to fetch
   * @returns Array of delegation records
   */
  public async getLastNRecords(count: number): Promise<DelegationRecord[]> {
    try {
      const response = await this.dryrun('', [
        { name: 'Action', value: ACTION_GET_LAST_N_RECORDS },
        { name: 'Count', value: count.toString() }
      ]);
      
      if (!response?.Messages?.length) {
        throw new Error('No data returned from Get-Last-N-Records');
      }
      
      return JSON.parse(response.Messages[0].Data) as DelegationRecord[];
    } catch (error: any) {
      throw new ClientError(this, this.getLastNRecords, { count }, error);
    }
  }
}
