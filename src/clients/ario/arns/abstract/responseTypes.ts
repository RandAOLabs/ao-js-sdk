
export interface ARNSRecordResponse {
	startTimestamp: number,
	endTimestamp: number,
	type: string,
	purchasePrice: number,
	undernameLimit: number,
	processId: string
}

/**
 * ARNS record with name field for paginated results
 */
export interface ARNSRecordWithName {
	startTimestamp: number;
	name: string;
	purchasePrice: number;
	type: string;
	undernameLimit: number;
	processId: string;
}

/**
 * Response interface for paginated ARNS records
 */
export interface GetArNSRecordsResponse {
	limit: number;
	totalItems: number;
	hasMore: boolean;
	nextCursor: string;
	items: ARNSRecordWithName[];
	sortOrder: string;
	sortBy: string;
}
