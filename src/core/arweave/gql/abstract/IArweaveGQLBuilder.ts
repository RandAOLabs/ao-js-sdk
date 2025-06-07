import { ArweaveGQLQuery, OwnerFields, AmountFields, DataFields, TagFields, BlockFields, ParentFields, ArweaveGQLSortOrder } from '../types';

/**
 * Interface for building Arweave GraphQL queries
 * @see {@link https://gql-guide.vercel.app/} for the full GraphQL API documentation
 */
export interface IArweaveGQLBuilder {
    /**
     * Filter transactions by multiple IDs
     * @param ids Array of transaction IDs
     */
    ids(ids: string[]): IArweaveGQLBuilder;

    /**
     * Filter transactions by a single ID
     * @param id Transaction ID
     */
    id(id: string): IArweaveGQLBuilder;

    /**
     * Filter transactions by multiple recipient addresses
     * @param addresses Array of recipient addresses
     */
    recipients(addresses: string[]): IArweaveGQLBuilder;

    /**
     * Filter transactions by a single recipient address
     * @param address Recipient address
     */
    recipient(address: string): IArweaveGQLBuilder;

    /**
     * Filter transactions by owner address
     * @param address Owner's address
     */
    owner(address: string): IArweaveGQLBuilder;

    /**
     * Filter transactions after the specified block height
     * @param height Block height
     */
    minBlockHeight(height: number): IArweaveGQLBuilder;

    /**
     * Filter transactions before the specified block height
     * @param height Block height
     */
    maxBlockHeight(height: number): IArweaveGQLBuilder;

    /**
     * Filter transactions by tags
     * @param tags Array of tag name-value pairs
     */
    tags(tags: { name: string; value: string }[]): IArweaveGQLBuilder;

    // Field selection methods
    withAnchor(): IArweaveGQLBuilder;
    withSignature(): IArweaveGQLBuilder;
    withRecipient(): IArweaveGQLBuilder;
    withIngestedAt(): IArweaveGQLBuilder;
    withOwner(fields?: Partial<OwnerFields>): IArweaveGQLBuilder;
    withFee(fields?: Partial<AmountFields>): IArweaveGQLBuilder;
    withQuantity(fields?: Partial<AmountFields>): IArweaveGQLBuilder;
    withData(fields?: Partial<DataFields>): IArweaveGQLBuilder;
    withTags(fields?: Partial<TagFields>): IArweaveGQLBuilder;
    withBlock(fields?: Partial<BlockFields>): IArweaveGQLBuilder;
    withParent(fields?: Partial<ParentFields>): IArweaveGQLBuilder;
    withAllFields(): IArweaveGQLBuilder;

    // Pagination and sorting options
    /**
     * Limit the number of results
     * @param count Maximum number of results to return
     */
    limit(count: number): IArweaveGQLBuilder;

    /**
     * Start results after the specified cursor
     * @param cursor Pagination cursor
     */
    after(cursor: string): IArweaveGQLBuilder;

    /**
     * Sort results by specified order
     * @param sort Sort order
     */
    sortBy(sort: ArweaveGQLSortOrder): IArweaveGQLBuilder;

    /**
     * Switch to count mode (returns count instead of results)
     */
    count(): IArweaveGQLBuilder;

    /**
     * Build and return the final GraphQL query
     */
    build(): ArweaveGQLQuery;
}
