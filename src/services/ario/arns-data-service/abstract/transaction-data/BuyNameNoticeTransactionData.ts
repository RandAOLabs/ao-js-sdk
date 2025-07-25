export interface FundingPlan {
	balance: number;
	address: string;
	shortfall: number;
	stakes: any[]; // TODO: Define proper type for stakes
}

export interface FundingResult {
	newWithdrawVaults: any[]; // TODO: Define proper type for withdraw vaults
	totalFunded: number;
}

export interface BuyNameNoticeTransactionData {
	startTimestamp: number;
	purchasePrice: number;
	type: string;
	baseRegistrationFee: number;
	fundingPlan: FundingPlan;
	processId: string;
	remainingBalance: number;
	name: string;
	endTimestamp: number;
	fundingResult: FundingResult;
	undernameLimit: number;
}
