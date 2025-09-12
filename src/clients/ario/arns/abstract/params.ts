/**
 * Parameters for getting paginated ARNS records
 * @inline
 */
export interface GetArNSRecordsParams {
	/**
	 * Cursor for pagination
	 */
	cursor?: string;

	/**
	 * Maximum number of records to retrieve
	 */
	limit?: number;
}
