import { DryRunCachingTokenClient } from "../../clients/ao/token/DryRunCachingTokenClient";
import { DryRunCachingClientConfigBuilder } from "../../core";
import ResultUtils from "../../core/common/result-utils/ResultUtils";
import { ICaching } from "../../utils/class-interfaces/ICaching";
import { CreditNotice, CreditNoticeService } from "../credit-notices";
import { ITokenService, TokenBalanceS } from "./abstract";


export class TokenService implements ITokenService, ICaching {
	private readonly tokenClient: DryRunCachingTokenClient;
	private readonly creditNoticeService: CreditNoticeService;

	//////// Constructor Methods //////////////

	public constructor(
		tokenProcessId: string,
		creditNoticeService?: CreditNoticeService
	) {
		const tokenConfig = new DryRunCachingClientConfigBuilder()
			.withProcessId(tokenProcessId)
			.build()
		this.tokenClient = new DryRunCachingTokenClient(tokenConfig)
		this.creditNoticeService = creditNoticeService ? creditNoticeService : CreditNoticeService.autoConfiguration()
	}


	//////// Public Methods //////////////
	public getProcessId(): string {
		return this.tokenClient.getProcessId()
	}

	public async getAllCreditNoticesTo(entityId: string): Promise<CreditNotice[]> {
		return this.creditNoticeService.getCreditNoticesBetween(this.getProcessId(), entityId)
	}

	public async getAllBalances(): Promise<TokenBalanceS[]> {
		const allBalances: TokenBalanceS[] = [];
		let cursor: string | undefined = undefined;
		let hasMore = true;
		const limit = 1000; // Use maximum limit to reduce number of requests

		// Implement pagination to get all balances
		while (hasMore) {
			const result = await this.tokenClient.balances(limit, cursor);
			const { balances, cursor: nextCursor } = this.extractBalancesFromResult(result);

			// Add the extracted balances to our collection
			allBalances.push(...balances);

			// Update cursor and check if we need to continue pagination
			cursor = nextCursor;
			hasMore = !!cursor;
		}

		return allBalances;
	}

	public async getBalance(address: string): Promise<bigint> {
		const allBalances = await this.getAllBalances();
		const balance = allBalances.find(b => b.entityId === address);

		if (balance) {
			return balance.balance;
		}

		// If no balance found, return 0 as bigint
		return BigInt(0);
	}

	public async getTotalHolders(): Promise<number> {
		const allBalances = await this.getAllBalances();
		// Count only addresses with positive balances
		const holdersCount = allBalances.filter(b => b.balance > BigInt(0)).length;
		return holdersCount;
	}

	/**
	 * Gets the total transaction volume for the token within a specified date range
	 * @param from Start date for the transaction volume calculation
	 * @param to End date for the transaction volume calculation
	 * @returns Promise resolving to the total transaction volume as a number
	 */
	public async getTransactionVolume(from: Date, to: Date): Promise<bigint> {
		// Get the token process ID
		const tokenProcessId = this.tokenClient.getProcessId();

		// Get all credit notices from this token process within the date range
		const creditNotices = await this.creditNoticeService.getAllCreditNoticesFromProcessForPeriod({
			tokenProcessId,
			fromDate: from,
			toDate: to
		});

		// Calculate the total volume by summing up the quantities
		const totalVolume = creditNotices.reduce((sum, notice) => {
			// Parse the quantity and add it to the sum
			return sum + BigInt(notice.quantity);
		}, BigInt(0));

		return totalVolume;
	}

	public clearCache(): void {
		this.tokenClient.clearCache()
	}

	//////// Private Methods //////////////

	/**
	 * Extracts balance information from a DryRunResult
	 * @param result The DryRunResult from balances() call
	 * @returns An object containing extracted balances and the next cursor
	 * @private
	 */
	private extractBalancesFromResult(result: any): { balances: TokenBalanceS[], cursor?: string } {
		const extractedBalances: TokenBalanceS[] = [];
		let nextCursor: string | undefined = undefined;

		// Use ResultUtils to parse the data from the message
		const data = ResultUtils.getFirstMessageDataJson(result);

		// If no data was parsed, return empty balances
		if (!data) {
			return { balances: extractedBalances };
		}

		// Process balances data - the data is expected to be in format { "id123":"10000", "id456":"10000" }
		// Convert this object format to TokenBalance array
		for (const [entityId, balance] of Object.entries(data)) {
			if (entityId && balance) {
				extractedBalances.push({
					entityId,
					balance: BigInt(balance)
				});
			}
		}

		// Extract cursor for pagination if it exists in the result
		// Check if there's a cursor in the Messages[0].Tags
		if (result.Messages && result.Messages.length > 0 && result.Messages[0].Tags) {
			const cursorTag = result.Messages[0].Tags.find((tag: any) => tag.name === 'Cursor');
			if (cursorTag) {
				nextCursor = cursorTag.value;
			}
		}

		return {
			balances: extractedBalances,
			cursor: nextCursor
		};
	}
}
