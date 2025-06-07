/**
 * Parameters for filtering messages by block height
 */
export interface BlockHeightFilterParams {
    /**
     * Filter messages after this block height
     */
    minBlockHeight?: number;

    /**
     * Filter messages before this block height
     */
    maxBlockHeight?: number;
}
