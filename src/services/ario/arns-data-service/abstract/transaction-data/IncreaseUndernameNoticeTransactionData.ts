export interface IncreaseUndernameRecord {
	startTimestamp: number;
	purchasePrice: number;
	type: string;
	undernameLimit: number;
	processId: string;
}

export interface IncreaseUndernameFundingPlan {
	balance: number;
	address: string;
	shortfall: number;
	stakes: any[]; // TODO: Define proper type for stakes
}

export interface IncreaseUndernameDemandFactor {
	revenueThisPeriod: number;
	currentPeriod: number;
	purchasesThisPeriod: number;
	fees: number[];
	consecutivePeriodsWithMinDemandFactor: number;
	currentDemandFactor: string;
	trailingPeriodPurchases: number[];
	trailingPeriodRevenues: number[];
}

export interface IncreaseUndernameFundingResult {
	newWithdrawVaults: any[]; // TODO: Define proper type for withdraw vaults
	totalFunded: number;
}

export interface IncreaseUndernameNoticeTransactionData {
	record: IncreaseUndernameRecord;
	baseRegistrationFee: number;
	fundingPlan: IncreaseUndernameFundingPlan;
	df: IncreaseUndernameDemandFactor;
	protocolBalance: number;
	remainingBalance: number;
	fundingResult: IncreaseUndernameFundingResult;
	reservedRecordsCount: number;
	totalFee: number;
	recordsCount: number;
}
