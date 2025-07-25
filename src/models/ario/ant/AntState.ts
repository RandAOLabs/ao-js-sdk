import { AntRecord } from "./AntRecord";

/**
 * Represents the complete state of an ANT (Arweave Name Token)
 */
export interface ANTState {
	/**
	 * Total supply of the ANT
	 */
	TotalSupply: number;

	/**
	 * Logo transaction ID
	 */
	Logo: string;

	/**
	 * Array of controller addresses
	 */
	Controllers: string[];

	/**
	 * Name of the ANT
	 */
	Name: string;

	/**
	 * Keywords associated with the ANT
	 */
	Keywords: string[];

	/**
	 * Whether the ANT has been initialized
	 */
	Initialized: boolean;

	/**
	 * Denomination value
	 */
	Denomination: number;

	/**
	 * Balance mapping of addresses to their token amounts
	 */
	Balances: Record<string, number>;

	/**
	 * Description of the ANT
	 */
	Description: string;

	/**
	 * Records mapping with transaction IDs and TTL settings
	 */
	Records: Record<string, AntRecord>;

	/**
	 * Ticker symbol
	 */
	Ticker: string;

	/**
	 * Owner address
	 */
	Owner: string;
}
