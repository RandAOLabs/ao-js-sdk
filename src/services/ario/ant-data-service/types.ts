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

/**
 * Represents the complete ANT (Arweave Name Token) state
 * Equivalent to Lua AntState type
 */
export interface AntState {
	/** The name of the ANT */
	Name: string;
	/** The ticker symbol for the ANT */
	Ticker: string;
	/** Description of the ANT */
	Description: string;
	/** Keywords associated with the ANT (Lua table<string> -> string[]) */
	Keywords: string[];
	/** Logo URL or identifier */
	Logo: string;
	/** Balance mapping from address to amount (Lua table<string, integer> -> Record<string, number>) */
	Balances: Record<string, number>;
	/** Owner address of the ANT */
	Owner: string;
	/** Array of controller addresses (Lua string[] -> string[]) */
	Controllers: string[];
	/** Denomination for the token */
	Denomination: number;
	/** Total supply of the token */
	TotalSupply: number;
	/** Whether the ANT has been initialized */
	Initialized: boolean;
	/** Records mapping from name to AntRecord (Lua table<string, Record> -> Record<string, AntRecord>) */
	Records: Record<string, AntRecord>;
}
