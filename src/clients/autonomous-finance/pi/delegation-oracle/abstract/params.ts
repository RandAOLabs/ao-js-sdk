export interface GetDelegationsParams {
    /**
     * The index of the delegation records to retrieve
     */
    index: number;

    /**
     * Optional format of the response, defaults to CSV
     */
    format?: string;

    /**
     * Optional nonce value for the request
     * If not provided, will be randomized by the client
     */
    nonce?: number;

    /**
     * Optional timestamp for the request
     * If not provided, defaults to current time
     */
    timestamp?: number;

    /**
     * Optional total number of records to retrieve
     * If not provided, defaults to 1
     */
    total?: number;
}
