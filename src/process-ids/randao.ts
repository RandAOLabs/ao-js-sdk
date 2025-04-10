const RANDAO_STAKING_PROCESS_ID: string = "ReO7FcKvUYsIGVZGTJXihjmnF5YCTyv4SoZF7THGblc"
const RANDAO_RNG_TOKEN_PROCESS_ID: string = "wCClZkYGE5kSRG1hhpDZy5Y4EG-Q6kAy_EfC--mPCbg"



export const RANDAO = {
    RNG_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    STAKING_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    /**
     * Typically retrieved from chain dynamically this value may be stale
     * arns name: api_randao
     */
    RANDOM: "yqlD760syDGXBQkC4ccpZFslFLv7uJ8haBMbPtr--Go",
    STAKING: RANDAO_STAKING_PROCESS_ID,
    PROFILE: RANDAO_STAKING_PROCESS_ID,
}
