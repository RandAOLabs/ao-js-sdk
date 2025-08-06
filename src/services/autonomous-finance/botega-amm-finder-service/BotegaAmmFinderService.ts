import SYSTEM_TAGS from "../../../core/common/tags";
import { BOTEGA_AMM_FACTORT } from "../../../constants/processIds/autonomous-finance";
import { IAutoconfiguration, staticImplements } from "../../../utils";
import { IAmmFinderService } from "../../amm-finder-service";
import { GetAllMessagesParams, IMessagesService, MessagesService } from "../../messages";
import { BOTEGA_TAGS } from "../../../constants/tags/botega";
import { BotegaAmmClient } from "../../../clients/autonomous-finance/botega/liquidity-pool/BotegaLiquidityPoolClient";
import { BotegaAmm } from "../../../adaptors/amm/BotegaAmm";
import { IAmm } from "../../../adaptors";


/**
 * Implementation of AMM finder service that locates AMM pools for token pairs.
 */
@staticImplements<IAutoconfiguration>()
export class BotegaAmmFinderService implements IAmmFinderService {
	constructor(
		private readonly messageService: IMessagesService,
	) { }

	/**
	 * Creates a pre-configured instance of BotegaAmmFinderService
	 * @returns A pre-configured BotegaAmmFinderService instance
	 */
	public static autoConfiguration(): IAmmFinderService {
		return new BotegaAmmFinderService(
			MessagesService.autoConfiguration()
		);
	}

	async findAmms(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm[]> {
		const queryParamsAB: GetAllMessagesParams = {
			tags: [
				SYSTEM_TAGS.FROM_PROCESS(BOTEGA_AMM_FACTORT),
				BOTEGA_TAGS.TOKEN_A(tokenProcessIdA),
				BOTEGA_TAGS.TOKEN_B(tokenProcessIdB)
			]
		}
		const queryParamsBA: GetAllMessagesParams = {
			tags: [
				SYSTEM_TAGS.FROM_PROCESS(BOTEGA_AMM_FACTORT),
				BOTEGA_TAGS.TOKEN_A(tokenProcessIdB),
				BOTEGA_TAGS.TOKEN_B(tokenProcessIdA)
			]
		}

		// Await both transactions concurrently
		const [transactionsAB, transactionsBA] = await Promise.all([
			this.messageService.getAllMessages(queryParamsAB),
			this.messageService.getAllMessages(queryParamsBA)
		]);

		// Combine all transactions and create a set of unique transactions
		const allTransactions = [...transactionsAB, ...transactionsBA];
		const uniqueTransactions = new Map();

		// Create a map of unique transactions by ID to avoid duplicates
		allTransactions.forEach(transaction => {
			if (transaction.id) {
				uniqueTransactions.set(transaction.id, transaction);
			}
		});

		// Create BotegaLiquidityPoolClient instances using the .from() method
		const amms: IAmm[] = Array.from(uniqueTransactions.values()).map(transaction =>
			BotegaAmm.from(transaction)
		);

		return amms;
	}
}
