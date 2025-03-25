import { GetDelegationsParams } from "./params";
import { GetDelegationsResponse } from "./responses";

export interface IDelegationOracleClient {
    /**
     * Retrieves delegation records from the PI Delegation Oracle.
     * @param params - Parameters for the delegation request including index, format, nonce, timestamp, and total
     * @returns A promise that resolves with the delegation records in CSV format
     */
    getDelegations(params: GetDelegationsParams): Promise<GetDelegationsResponse>;
}
