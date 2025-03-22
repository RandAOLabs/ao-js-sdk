const RANDAO_STAKING_PROCESS_ID: string = "EIQJoqVWonlxsEe8xGpQZhh54wrmgE3q0tAsVIhKYQU"
const RANDAO_RNG_TOKEN_PROCESS_ID: string = "5ZR9uegKoEhE9fJMbs-MvWLIztMNCVxgpzfeBVE3vqI"



export const RANDAO = {
    RNG_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    STAKING_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    /**
     * Typically retrieved from chain dynamically this value may be stale
     * arns name: api_randao
     */
    RANDOM: "1dnDvaDRQ7Ao6o1ohTr7NNrN5mp1CpsXFrWm3JJFEs8",
    STAKING: RANDAO_STAKING_PROCESS_ID,
    PROFILE: RANDAO_STAKING_PROCESS_ID,
}
