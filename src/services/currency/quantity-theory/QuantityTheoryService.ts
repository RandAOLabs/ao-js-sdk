import { CreditNotice, CreditNoticeService } from "../../credit-notices";
import { ITokenService } from "../../token-service";
import { IQuantityTheoryService } from "./abstract/IQuantityTheoryService";

export class QuanityTheoryService implements IQuantityTheoryService {
	private readonly tokenService: ITokenService;
	private readonly creditNoticeService: CreditNoticeService;
	private excludedEntityIds: string[] = [];
	private includedProductProcessIds: string[] = [];
	private fromDate: Date = new Date(0); // Unix epoch
	private toDate: Date = new Date(); // Current date
	//////// Constructors Methods //////////////

	public constructor(
		tokenService: ITokenService,
		excludedEntityIds: string[] = [],
		includedProductProcessIds: string[] = [],
		fromDate: Date = new Date(0),
		toDate: Date = new Date(),
		creditNoticeService?: CreditNoticeService
	) {
		this.tokenService = tokenService;
		this.excludedEntityIds = excludedEntityIds;
		this.includedProductProcessIds = includedProductProcessIds;
		this.fromDate = fromDate;
		this.toDate = toDate;
		this.creditNoticeService = creditNoticeService ? creditNoticeService : CreditNoticeService.autoConfiguration();
	}
	//////// Public Methods //////////////

	/**
	 * Set excluded entity IDs for M calculation
	 * @param ids Array of entity IDs to exclude
	 */
	public setExcludedEntityIds(ids: string[]): void {
		this.excludedEntityIds = ids;
	}

	/**
	 * Set included product process IDs for P and Q calculations
	 * @param ids Array of product process IDs to include
	 */
	public setIncludedProductProcessIds(ids: string[]): void {
		this.includedProductProcessIds = ids;
	}

	/**
	 * Set date range for V calculation
	 * @param from Start date
	 * @param to End date
	 */
	public setDateRange(from: Date, to: Date): void {
		this.fromDate = from;
		this.toDate = to;
	}

	public async calculateM(): Promise<bigint> {
		const balances = await this.tokenService.getAllBalances();
		// Filter out excluded entities and sum the balances
		const filteredBalances = balances.filter(balance => 
			!this.excludedEntityIds.includes(balance.entityId)
		);
		
		// Sum the balances
		return filteredBalances.reduce((sum, balance) => {
			return sum + balance.balance;
		}, BigInt(0));
	}

	public async calculateQ(): Promise<bigint> {
		const creditNotices = await this._getCreditNoticesForProductProcessIds(this.includedProductProcessIds);
		return BigInt(creditNotices.length);
	}

	public async calculateP(): Promise<bigint> {
		const creditNotices = await this._getCreditNoticesForProductProcessIds(this.includedProductProcessIds);
		
		if (creditNotices.length === 0) {
			return BigInt(0);
		}
		
		// Calculate the sum of all quantities
		const totalQuantity = creditNotices.reduce((sum, notice) => {
			return sum + BigInt(notice.quantity);
		}, BigInt(0));
		
		// Calculate the average (P)
		return totalQuantity / BigInt(creditNotices.length);
	}

	public async calculateV(): Promise<bigint> {
		return this.tokenService.getTransactionVolume(this.fromDate, this.toDate);
	}
	//////// Private Methods //////////////

	/**
	 * Gets all credit notices for the included product process IDs
	 * @param includedProductProcessIds Array of product process IDs to include
	 * @returns Array of credit notices from the included process IDs
	 */
	private async _getCreditNoticesForProductProcessIds(includedProductProcessIds: string[]): Promise<CreditNotice[]> {
		// If no product process IDs are specified, get all credit notices for the current process
		if (!includedProductProcessIds || includedProductProcessIds.length === 0) {
			return []
		}
		
		// Get credit notices for each included process ID and combine them
		const creditNoticesPromises = includedProductProcessIds.map(processId => 
			this.tokenService.getAllCreditNoticesTo(processId)
		);
		
		// Wait for all promises to resolve and flatten the array
		const creditNoticesArrays = await Promise.all(creditNoticesPromises);
		return creditNoticesArrays.flat();
	}
}
