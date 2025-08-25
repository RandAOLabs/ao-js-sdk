const RANDAO_STAKING_PROCESS_ID: string = "Z7pQgW5PYZDHQOnYw-AKDV-9ZUJ3KR5EPDMqCGWkrAQ"
const RANDAO_RNG_TOKEN_PROCESS_ID: string = "rPpsRk9Rm8_SJ1JF8m9_zjTalkv9Soaa_5U0tYUloeY"



export const RANDAO = {
    RNG_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    STAKING_TOKEN: RANDAO_RNG_TOKEN_PROCESS_ID,
    /**
     * Typically retrieved from chain dynamically this value may be stale
     * arns name: api_randao
     */
    RANDOM: "1nTos_shMV8HlC7f2svZNZ3J09BROKCTK8DyvkrzLag",
    STAKING: RANDAO_STAKING_PROCESS_ID,
    PROFILE: RANDAO_STAKING_PROCESS_ID,
}
