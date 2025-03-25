export interface GetDelegationsResponse {
    /**
     * CSV formatted delegation records in the format:
     * delegator,amount,delegatee,AO
     */
    delegations: string;
}
