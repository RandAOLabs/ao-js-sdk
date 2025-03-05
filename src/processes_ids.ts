//Randao
export const RNG_TOKEN_PROCESS_ID: string = "5ZR9uegKoEhE9fJMbs-MvWLIztMNCVxgpzfeBVE3vqI"
export const RANDOM_PROCESS_ID: string = "1dnDvaDRQ7Ao6o1ohTr7NNrN5mp1CpsXFrWm3JJFEs8"
export const RANDAO_STAKING_TOKEN_PROCESS_ID: string = RNG_TOKEN_PROCESS_ID
export const RANDAO_STAKING_PROCESS_ID: string = "EIQJoqVWonlxsEe8xGpQZhh54wrmgE3q0tAsVIhKYQU"
export const RANDAO_PROFILE_PROCESS_ID: string = RANDAO_STAKING_PROCESS_ID
export const RAFFLE_PROCESS_ID = "RQZBPcI-EUVb9rdcbiIN0eggYSJNLgdFuD7G_GztreQ"

export const STAKING_PROCESS_ID: string = "EIQJoqVWonlxsEe8xGpQZhh54wrmgE3q0tAsVIhKYQU"
export const STAKING_TOKEN_PROCESS_ID: string = RNG_TOKEN_PROCESS_ID

export const NFT_SALE_PROCESS_ID: string = "ewO-sg8QM8xK_yM_ERzvbOZ4DCbTGoBK51uZnc3MENw"
export const ARCAO_TEST_TOKEN_PROCESS_ID: string = STAKING_TOKEN_PROCESS_ID
export const ARCAO_TEST_NFT_COLLECTION: string = "Kvrlp7PFbtxLohR8g5PKYRzKccAsK09cpAWqGLLL_1M"

//RuneRealm
export const RUNE_REALM_PAYMENTS_PROCESS_ID: string = "j7NcraZUL6GZlgdPEoph12Q5rk_dydvQDecLNxYi8rI"

/*In theory these never need to change*/
export const PROFILE_REGISTRY_PROCESS_ID: string = "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY"
export const ARNS_REGISTRY_PROCESS_ID: string = "agYcCFJtrMG6cqMuZfskIkFTGvUPddICmtQSBIoPdiA" // TODO: Replace when ARNS hits mainnet

// Also export as a single namespace object
export const processIds = {
    RNG_TOKEN_PROCESS_ID,
    RANDOM_PROCESS_ID,
    STAKING_PROCESS_ID,
    STAKING_TOKEN_PROCESS_ID,
    NFT_SALE_PROCESS_ID,
    ARCAO_TEST_TOKEN_PROCESS_ID,
    ARCAO_TEST_NFT_COLLECTION,
    PROFILE_REGISTRY_PROCESS_ID,
    ARNS_PROCESS_ID: ARNS_REGISTRY_PROCESS_ID,
    RUNE_REALM_PAYMENTS_PROCESS_ID,
} as const
