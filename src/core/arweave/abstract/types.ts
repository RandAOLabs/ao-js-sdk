export interface FullArweaveTransaction {
	id: string;
	anchor: string;
	signature: string;
	recipient: string;
	ingested_at: number;
	owner: {
		address: string;
		key: string;
	};
	fee: {
		winston: string;
		ar: string;
	};
	quantity: {
		winston: string;
		ar: string;
	};
	data: {
		size: string;
		type: string;
	};
	tags: {
		name: string;
		value: string;
	}[];
	block: {
		id: string;
		timestamp: number;
		height: number;
		previous: string;
	};
	parent: {
		id: string;
	};
}

// Alias for backward compatibility
export type ArweaveTransaction = Partial<FullArweaveTransaction>;

export interface ArweaveTransactionWithData {
	transaction: ArweaveTransaction;
	data: any | string;
}

export interface ArweaveGQLResponse {
	data: {
		transactions: {
			edges: Array<{
				cursor: string;
				node: ArweaveTransaction;
			}>;
			count?: number;
		};
	};
}
