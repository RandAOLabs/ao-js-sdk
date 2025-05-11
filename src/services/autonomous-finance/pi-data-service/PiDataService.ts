import { Observable, from, map, mergeMap } from 'rxjs';
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
import { DelegationPreferencesResponse } from './abstract/responses';

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
						return []//this.arweaveDataService.getTransactionData<DelegationPreferencesResponse>(responseMessage.id);
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

	/**
	 * Gets the latest response message for a delegation transaction
	 * @param delegation The delegation transaction to get response for
	 * @returns Observable that resolves to the latest response message or undefined if none found
	 */
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
}
