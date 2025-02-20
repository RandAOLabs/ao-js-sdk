/**
 * Specifies the order in which to fetch results from ao processes.
 * Used when retrieving paginated sets of results from process queries.
 * @see {@link https://cookbook_ao.g8way.io/guides/aoconnect/reading-results.html#fetching-a-set-of-results | Result fetching guide}
 */
export enum SortOrder {
    /** Sort results in ascending order */
    ASCENDING = 'ASC',
    /** Sort results in descending order */
    DESCENDING = 'DESC'
}
