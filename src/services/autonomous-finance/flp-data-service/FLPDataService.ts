import { IFLPDataSercvice } from './abstract/IFLPDataService';
import { Logger } from '../../../utils/logger/logger';
import { ArweaveDataService, IArweaveDataService } from '../../../core';
import { IMessagesService } from '../../messages/message-service/abstract/IMessagesService';
import { MessagesService } from '../../messages/message-service/MessagesService';
import { Distribution } from './abstract/responses';
import { FLP_TAGS } from './tags';


/**
 * @category Autonomous Finance
 * @inheritdoc
 */
export class FLPDataService implements IFLPDataSercvice {
	constructor(
		private readonly messagesService: IMessagesService,
		private readonly arweaveDataService: IArweaveDataService,
		private readonly processId: string
	) { }

	/**
	 * Creates a pre-configured instance of FLPDataService
	 * @param processId The process ID for the FLP
	 * @returns A pre-configured FLPDataService instance
	 */
	public static autoConfiguration(processId: string): IFLPDataSercvice {
		return new FLPDataService(
			MessagesService.autoConfiguration(),
			ArweaveDataService.autoConfiguration(),
			processId
		);
	}

	public async getMostRecentDistributions(): Promise<Distribution[]> {
		try {
			// Get the latest message with the specified tags
			const response = await this.messagesService.getLatestMessages({
				limit: 1,
				tags: [
					FLP_TAGS.ACTION_BATCH_TRANSFER,
					FLP_TAGS.FROM_PROCESS(this.processId)
				]
			});

			if (!response.messages || response.messages.length === 0) {
				Logger.info('No distribution messages found');
				return [];
			}

			const transaction = response.messages[0];

			// Ensure transaction has an ID
			if (!transaction.id) {
				throw new Error('Transaction ID is missing');
			}

			// Get the transaction data using ArweaveDataService
			const transactionData = await this.arweaveDataService.getTransactionDataString(transaction.id);

			// Parse the transaction data into distributions
			return this.parseDistributionData(transactionData);
		} catch (error: any) {
			Logger.error(`Failed to get most recent distributions: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Parses the transaction data string into Distribution objects
	 * @param data The transaction data string in format: "address1,amount1\naddress2,amount2\n..."
	 * @returns Array of Distribution objects
	 */
	private parseDistributionData(data: string): Distribution[] {
		try {
			const distributions: Distribution[] = [];
			const entries = data.trim().split(/[\n\r]+/);

			for (const entry of entries) {
				if (entry.trim()) {
					const [address, amount] = entry.split(',');
					if (address && amount) {
						distributions.push({
							address: address.trim(),
							amount: amount.trim()
						});
					}
				}
			}

			return distributions;
		} catch (error: any) {
			Logger.error(`Failed to parse distribution data: ${error.message}`);
			throw new Error(`Invalid distribution data format: ${error.message}`);
		}
	}

	public async getUsersMostRecentDistributions(address: string): Promise<Distribution | null> {
		const distributions = await this.getMostRecentDistributions();
		return distributions.find(dist => dist.address === address) || null;
	}

}
