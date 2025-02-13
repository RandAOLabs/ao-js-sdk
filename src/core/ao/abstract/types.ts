/**
 * Represents message tags sent to an ao process.
 * Tags are key-value pairs that provide metadata and instructions for message processing.
 * @see {@link https://cookbook_ao.g8way.io/concepts/messages.html | Message specification}
 */
export type Tags = {
    /** The name/key of the tag */
    name: string;
    /** The value associated with the tag */
    value: string;
}[];

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
