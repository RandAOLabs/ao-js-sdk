/**
 * Represents a record in the ANT state
 * Equivalent to Lua Record type
 */
export interface AntRecord {
	/** The transaction ID associated with the record */
	transactionId: string;
	/** Time to live in seconds */
	ttlSeconds: number;
	/** Priority level (optional) */
	priority?: number;
}
