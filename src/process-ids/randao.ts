const RANDAO_STAKING_PROCESS_ID: string = "GZN3ouFj7db4qzpmCCTo6k3sCpZWoYQp-RoPGI-Cxuk"
const RANDAO_RNG_TOKEN_PROCESS_ID: string = "MlcQtVXNE34KhWoYgIDAwvQ1g9nhQvaYHTtsJVvUJfg"



export const RANDAO = {
    RNG_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    STAKING_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    /**
     * Typically retrieved from chain dynamically this value may be stale
     * arns name: api_randao
     */
    RANDOM: "9ZXTvznyUo266uIU8nHPMsAtI8NntFdmsET3M3Hv_FA",
    STAKING: RANDAO_STAKING_PROCESS_ID,
    PROFILE: RANDAO_STAKING_PROCESS_ID,
}
