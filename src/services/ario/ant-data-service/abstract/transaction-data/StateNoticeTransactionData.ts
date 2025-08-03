export interface StateNoticeTransactionData {
	Owner: string;
	TotalSupply: number;
	Balances: Record<string, number>;
	Records: Record<string, {
		transactionId: string;
		ttlSeconds: number;
	}>;
	Keywords: string[];
	Denomination: number;
	Controllers: string[];
	Logo: string;
	Initialized: boolean;
	Description: string;
	Name: string;
	Ticker: string;
}
