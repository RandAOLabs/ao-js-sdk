import { Observable, from, map, mergeMap, timestamp } from 'rxjs';
import { IPiDataService } from './abstract/IPiDataService';
import { IReactiveMessageService, ReactiveMessageService } from '../../messages';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { AUTONOMOUS_FINANCE, PI_DELEGATE_PROCESS_ID } from '../../../process-ids/autonomous-finance';
import { ACTION_SET_DELEGATION } from '../../../clients/pi/constants';
import { ArweaveTransaction } from '../../../core/arweave/abstract/types';
import { Logger } from '../../../utils/logger/logger';
import { TagUtils } from '../../../core/common';
import { ArweaveDataService, IArweaveDataService } from '../../../core';
import { DelegationPreferencesResponse, DelegationPreferencesResponseWithBalance, SimplifiedDelegationResponse, DelegationHistoryData, FLPYieldHistoryEntry } from './abstract/responses';

/**
 * Implementation of the Pi Data Service that provides streaming data capabilities
 */
@staticImplements<IAutoconfiguration>()
export class PiDataService implements IPiDataService {
	constructor(
		private readonly reactiveMessageService: IReactiveMessageService,
		private readonly arweaveDataService: IArweaveDataService
	) { }

	/**
	 * Creates a pre-configured instance of PiDataService
	 * @returns A pre-configured PiDataService instance
	 */
	public static autoConfiguration(): PiDataService {
		return new PiDataService(
			ReactiveMessageService.autoConfiguration(),
			ArweaveDataService.autoConfiguration()
		);
	}



	/**
	 * Gets all current delegations with their allocation responses
	 * @returns Observable stream of allocation response messages
	 */
	public getAllPiDelegationPreferences(): Observable<DelegationPreferencesResponse[]> {
		return this.getAllPiDelegationMessages().pipe(
			map(delegations => this.filterLatestDelegations(delegations)),
			mergeMap(delegations => this.getDelegationResponses(delegations)),
			map(responses => this.filterUniqueWallets(responses))
		);
	}

	/**
	 * Gets all current delegations with their allocation responses and wallet balances
	 * @returns Observable stream of allocation response messages with balances
	 */
	public getAllPiDelegationPreferencesWithBalances(): Observable<DelegationPreferencesResponseWithBalance[]> {
		return this.getAllPiDelegationPreferences().pipe(
			mergeMap(async (responses) => this.fetchWalletBalancesForResponses(responses))
		);
	}

	/**
	 * Gets current delegations for a specific delegated address with simplified response format
	 * @param delegatedTo The wallet address to get delegations for
	 * @returns Observable stream of simplified delegation responses where walletTo matches delegatedTo
	 */
	public getCurrentDelegationsForAddress(delegatedTo: string): Observable<SimplifiedDelegationResponse[]> {
		return this.getAllPiDelegationPreferencesWithBalances().pipe(
			map(responses => responses.filter(response => 
				response.delegationPrefs.some(pref => pref.walletTo === delegatedTo)
			)),
			map(responses => responses.map(response => {
				// Find the matching delegation preference
				const matchingPref = response.delegationPrefs.find(pref => pref.walletTo === delegatedTo)!;
				
				// Calculate percentage based on factor relative to total factor
				const percentDelegated = (matchingPref.factor / response.totalFactor) * 100;
				
				// Calculate delegated amount based on percentage of total balance
				const arweaveAmountDelegated = Math.floor(response.balance * (percentDelegated / 100));

				return {
					delegatorWalletAddress: response.wallet,
					delegatedWalletAddress: delegatedTo,
					totalArweaveOwned: response.balance,
					timestamp: response.lastUpdate,
					percentDelegated,
					arweaveAmountDelegated,
				};
			}))
		);
	}

	/**
	 * Fetches wallet balances for an array of delegation responses
	 * @param responses Array of delegation responses to fetch balances for
	 * @returns Promise resolving to array of responses with balances (excluding any that failed to fetch)
	 * @private
	 */
	private async fetchWalletBalancesForResponses(
		responses: DelegationPreferencesResponse[]
	): Promise<DelegationPreferencesResponseWithBalance[]> {
		// Fetch balances for all wallets in parallel
		const responsesWithBalances = await Promise.all(
			responses.map(async (response) => {
				try {
					const balance = await this.arweaveDataService.getWalletBalance(response.wallet);
					return {
						...response,
						balance
					};
				} catch (error: any) {
					Logger.error(`Failed to get balance for wallet ${response.wallet}: ${error.message}`);
					// Skip responses where balance fetch fails
					return null;
				}
			})
		);

		// Filter out null responses where balance fetch failed
		return responsesWithBalances.filter(
			(response): response is DelegationPreferencesResponseWithBalance => response !== null
		);
	}

	/**
	 * Filters delegations to keep only the latest transaction per owner address
	 * @param delegations Array of delegation transactions
	 * @returns Array of unique delegations with highest block height per owner
	 */
	private filterLatestDelegations(delegations: ArweaveTransaction[]): ArweaveTransaction[] {
		const ownerMap = new Map<string, ArweaveTransaction>();

		delegations.forEach(delegation => {
			const owner = delegation.owner?.address;
			if (!owner) {
				Logger.debug(`Skipping delegation due to missing owner address: ${JSON.stringify(delegation)}`);
				return;
			}

			const existingDelegation = ownerMap.get(owner);
			if (!existingDelegation || (delegation.block?.height || 0) > (existingDelegation.block?.height || 0)) {
				ownerMap.set(owner, delegation);
			}
		});

		return Array.from(ownerMap.values());
	}

	/**
	 * Retrieves all pi delegation messages without filtering
	 * @returns Observable stream of all pi delegation messages
	 */
	public getAllPiDelegationMessages(): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				{ name: 'Action', value: ACTION_SET_DELEGATION }
			],
			recipient: PI_DELEGATE_PROCESS_ID
		});
	}

	/**
	 * Gets delegation responses from delegation messages with concurrency control
	 * @param delegations Array of delegation messages
	 * @returns Observable of delegation preference responses that have been rate limited
	 */
	private getDelegationResponses(delegations: ArweaveTransaction[]): Observable<DelegationPreferencesResponse[]> {
		const MAX_CONCURRENT = 1; // Maximum number of concurrent requests

		return from(delegations).pipe(
			// Process up to MAX_CONCURRENT delegations simultaneously
			mergeMap((delegation: ArweaveTransaction) =>
				this.getLatestDelegationResponse(delegation).pipe(
					mergeMap(responseMessage => {
						if (!responseMessage?.id) {
							Logger.debug(`Skipping response message due to missing id: ${JSON.stringify(responseMessage)}`);
							return [];
						}
						return this.arweaveDataService.getTransactionData<DelegationPreferencesResponse>(responseMessage.id);
					})
				),
				MAX_CONCURRENT // Concurrency limit
			),
			// Collect all responses into an array
			map(response => [response].filter(Boolean)),
			map((responses: DelegationPreferencesResponse[]) => responses.flat())
		);
	}

	/**
	 * Filters responses to keep only unique wallets with highest lastUpdate
	 * @param responses Array of delegation preference responses
	 * @returns Array of unique responses with highest lastUpdate per wallet
	 */
	private filterUniqueWallets(responses: DelegationPreferencesResponse[]): DelegationPreferencesResponse[] {
		const walletMap = new Map<string, DelegationPreferencesResponse>();

		responses.forEach(response => {
			const existingResponse = walletMap.get(response.wallet);
			if (!existingResponse || existingResponse.lastUpdate < response.lastUpdate) {
				walletMap.set(response.wallet, response);
			}
		});

		return Array.from(walletMap.values());
	}

	private getLatestDelegationResponse(
		delegation: ArweaveTransaction,
	): Observable<ArweaveTransaction | undefined> {
		const responseRecipient = delegation.owner?.address
		if (!responseRecipient) {
			Logger.debug(`Skipping delegation due to missing properties: ${JSON.stringify(delegation)}`);
			return new Observable<undefined>(subscriber => {
				subscriber.next(undefined);
				subscriber.complete();
			});
		}

		return this.reactiveMessageService.getLatestMessage({
			tags: [
				{ name: 'From-Process', value: AUTONOMOUS_FINANCE.PI_DELEGATE_PROCESS_ID },
			],
			recipient : responseRecipient
		});
	}

	/**
	 * Gets all messages with the Add-Own-Mint-Report action between PI_TOKEN_PROCESS_ID endpoints
	 * @returns Observable stream of Arweave transactions matching the criteria
	 */
	public getMintReportMessages(): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				{ name: 'Action', value: 'Add-Own-Mint-Report' },
				{ name: 'From-Process', value: AUTONOMOUS_FINANCE.PI_TOKEN_PROCESS_ID }
			],
			recipient: AUTONOMOUS_FINANCE.PI_TOKEN_PROCESS_ID
		});
	}

	/**
	 * Gets all direct delegation history messages from PI_DELEGATE_PROCESS_ID to PI_DELEGATION_HISTORIAN
	 * @returns Observable stream of Arweave transactions matching the criteria
	 */
	/**
	 * Gets all FLP yield history entries with timestamps
	 * @returns Observable stream of FLP yield history entries
	 */
	public getFLPYieldHistory(): Observable<FLPYieldHistoryEntry[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				{ name: 'Action', value: 'Save-Direct-Delegation-History' },
				{ name: 'From-Process', value: AUTONOMOUS_FINANCE.PI_DELEGATE_PROCESS_ID }
			],
			recipient: AUTONOMOUS_FINANCE.PI_DELEGATION_HISTORIAN
		}).pipe(
			mergeMap(async (transactions) => {
				const entries = await Promise.all(
					transactions.map(async (tx) => {
						if (!tx.id) {
							Logger.debug(`Skipping transaction due to missing id: ${JSON.stringify(tx)}`);
							return null;
						}

						try {
							const data = await this.arweaveDataService.getTransactionData<DelegationHistoryData>(tx.id);
							return {
								...data,
								timestamp: tx.block?.timestamp || 0
							};
						} catch (error: any) {
							Logger.error(`Failed to get transaction data for ${tx.id}: ${error.message}`);
							return null;
						}
					})
				);

				// Filter out null entries and sort by timestamp descending
				return entries
					.filter((entry): entry is FLPYieldHistoryEntry => entry !== null)
					.sort((a, b) => b.timestamp - a.timestamp);
			})
		);
	}
}
