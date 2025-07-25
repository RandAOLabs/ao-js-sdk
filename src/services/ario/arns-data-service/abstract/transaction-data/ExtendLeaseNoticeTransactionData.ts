export interface ExtendLeaseFundingResult {
	newWithdrawVaults: any[]; // TODO: Define proper type for withdraw vaults
	totalFunded: number;
}

export interface ExtendLeaseFundingPlan {
	balance: number;
	address: string;
	shortfall: number;
	stakes: any[]; // TODO: Define proper type for stakes
}

export interface ExtendLeaseRecord {
	startTimestamp: number;
	endTimestamp: number;
	type: string;
	purchasePrice: number;
	undernameLimit: number;
	processId: string;
}

export interface ExtendLeaseDemandFactor {
	revenueThisPeriod: number;
	currentPeriod: number;
	purchasesThisPeriod: number;
	fees: number[];
	consecutivePeriodsWithMinDemandFactor: number;
	currentDemandFactor: string;
	trailingPeriodPurchases: number[];
	trailingPeriodRevenues: number[];
}

export interface ExtendLeaseNoticeTransactionData {
	protocolBalance: number;
	remainingBalance: number;
	fundingResult: ExtendLeaseFundingResult;
	fundingPlan: ExtendLeaseFundingPlan;
	record: ExtendLeaseRecord;
	baseRegistrationFee: number;
	totalFee: number;
	df: ExtendLeaseDemandFactor;
}
