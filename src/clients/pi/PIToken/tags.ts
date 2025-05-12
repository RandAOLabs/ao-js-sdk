/**
 * Action tags for PI Token operations
 */
export const TAGS = {
    ACTION: {
        INFO: { name: "Action", value: "Info" },
        GET_YIELD_TICK_HISTORY: { name: "Action", value: "Get-Yield-Tick-History" },
        BALANCE: { name: "Action", value: "Balance" },
        GET_CLAIMABLE_BALANCE: { name: "Action", value: "Get-Claimable-Balance" },
        GET_DELEGATIONS: { name: "Action", value: "Get-Delegations" },
        SET_DELEGATION: { name: "Action", value: "Set-Delegation" },
        GET_FLPS: { name: "Action", value: "Get-FLPs" }
    },
    RESPONSE: {
        DELEGATION_INFO: { name: "Response", value: "Get-Delegations" },
        TOKEN_INFO: { name: "Response", value: "Info-Response" },
        TICK_HISTORY: { name: "Response", value: "Get-Yield-Tick-History" },
        PI_TOKENS: { name: "Response", value: "Get-FLPs" }
    }
}

export default TAGS;
