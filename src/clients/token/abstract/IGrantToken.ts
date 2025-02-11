export interface IGrantToken {
    /**
     * Grants tokens to a recipient address
     * @param quantity The amount of tokens to grant
     * @param recipient The recipient address, defaults to the calling wallet address
     * @returns Promise resolving to boolean indicating success
     */
    grant(quantity: string, recipient?: string): Promise<boolean>;
}
