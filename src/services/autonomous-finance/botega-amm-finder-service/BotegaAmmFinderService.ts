import SYSTEM_TAGS, { SYSTEM_SCHEDULER_TAG_NAME } from "../../../core/common/tags";
import { BOTEGA_AMM_FACTORT } from "../../../constants/processIds/autonomous-finance";
import { IAutoconfiguration, Logger, staticImplements } from "../../../utils";
import { IAmmFinderService } from "../../amm-finder-service";
import { GetAllMessagesParams, IMessagesService, MessagesService } from "../../messages";
import { BOTEGA_TAGS } from "../../../constants/tags/botega";
import { BotegaAmmClient } from "../../../clients/autonomous-finance/botega/liquidity-pool/BotegaLiquidityPoolClient";
import { BotegaAmm } from "../../../adaptors/amm/BotegaAmm";
import { IAmm } from "../../../adaptors";
import { ArweaveGQLBuilder, ArweaveGQLSortOrder } from "../../../core";


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
		const gqlBuilder1 = new ArweaveGQLBuilder()
			.withAllFields()
			.sortBy(ArweaveGQLSortOrder.HEIGHT_DESC)
			.limit(100)
			.tags([
				SYSTEM_TAGS.FROM_PROCESS(BOTEGA_AMM_FACTORT),
				BOTEGA_TAGS.TOKEN_A(tokenProcessIdA),
				BOTEGA_TAGS.TOKEN_B(tokenProcessIdB)
			])
			.containsTagName(SYSTEM_SCHEDULER_TAG_NAME);

		const gqlBuilder2 = new ArweaveGQLBuilder()
			.withAllFields()
			.sortBy(ArweaveGQLSortOrder.HEIGHT_DESC)
			.limit(100)
			.tags([
				SYSTEM_TAGS.FROM_PROCESS(BOTEGA_AMM_FACTORT),
				BOTEGA_TAGS.TOKEN_A(tokenProcessIdB),
				BOTEGA_TAGS.TOKEN_B(tokenProcessIdA)
			])
			.containsTagName(SYSTEM_SCHEDULER_TAG_NAME);

		// Await both transactions concurrently
		const [transactionsAB, transactionsBA] = await Promise.all([
			this.messageService.getAllMessagesWithBuilder(gqlBuilder1),
			this.messageService.getAllMessagesWithBuilder(gqlBuilder2)
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


	async findBestAmm(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm> {
		const amms = await this.findAmms(tokenProcessIdA, tokenProcessIdB)
		if (amms.length == 1) {
			return amms[0]
		} else {
			return this.chooseBestAmm(amms)
		}
	}

	private async chooseBestAmm(amms: IAmm[]): Promise<IAmm> {
		Logger.warn("AMM CHOICE UNIMPLEMENTED DEFAULTING UNKNONW")
		return amms[0] //TODO find the best AMM
	}
}
