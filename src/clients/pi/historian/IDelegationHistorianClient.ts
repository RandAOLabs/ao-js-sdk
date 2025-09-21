import { IProcessClient } from '../../../core/ao/abstract/IProcessClient';

export interface DelegationRecord {
	timestamp: number;
	delegations: {
		[projectId: string]: string; // projectId -> delegated amount
	};
}

export interface ProjectDelegationTotal {
	projectId: string;
	amount: string;
}

export interface IDelegationHistorianClient extends IProcessClient {
	/**
	 * Fetches the total delegated AO by project
	 * @returns Array of project delegation totals
	 */
	getTotalDelegatedAOByProject(): Promise<ProjectDelegationTotal[]>;

	/**
	 * Fetches the last record of delegations
	 * @returns The last delegation record
	 */
	getLastRecord(): Promise<DelegationRecord>;

	/**
	 * Fetches the last N records of delegations
	 * @param count Number of records to fetch
	 * @returns Array of delegation records
	 */
	getLastNRecords(count: number): Promise<DelegationRecord[]>;
}
