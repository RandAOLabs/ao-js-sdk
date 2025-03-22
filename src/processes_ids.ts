//Randao
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RNG_TOKEN_PROCESS_ID: string = "5ZR9uegKoEhE9fJMbs-MvWLIztMNCVxgpzfeBVE3vqI"
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RANDOM_PROCESS_ID: string = "1dnDvaDRQ7Ao6o1ohTr7NNrN5mp1CpsXFrWm3JJFEs8"
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RANDAO_STAKING_TOKEN_PROCESS_ID: string = RNG_TOKEN_PROCESS_ID
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RANDAO_STAKING_PROCESS_ID: string = "EIQJoqVWonlxsEe8xGpQZhh54wrmgE3q0tAsVIhKYQU"
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RANDAO_PROFILE_PROCESS_ID: string = RANDAO_STAKING_PROCESS_ID
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const RAFFLE_PROCESS_ID = "RQZBPcI-EUVb9rdcbiIN0eggYSJNLgdFuD7G_GztreQ"

/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const NFT_SALE_PROCESS_ID: string = "ewO-sg8QM8xK_yM_ERzvbOZ4DCbTGoBK51uZnc3MENw"
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const ARCAO_TEST_TOKEN_PROCESS_ID: string = RNG_TOKEN_PROCESS_ID
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const ARCAO_TEST_NFT_COLLECTION: string = "Kvrlp7PFbtxLohR8g5PKYRzKccAsK09cpAWqGLLL_1M"

/*In theory these never need to change*/
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const PROFILE_REGISTRY_PROCESS_ID: string = "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY"
/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const ARNS_REGISTRY_PROCESS_ID: string = "qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE"

/**
 * @deprecated in favor of {@link PROCESS_IDS}
 */
export const processIds = {
    RNG_TOKEN_PROCESS_ID,
    RANDOM_PROCESS_ID,
    NFT_SALE_PROCESS_ID,
    ARCAO_TEST_TOKEN_PROCESS_ID,
    ARCAO_TEST_NFT_COLLECTION,
    PROFILE_REGISTRY_PROCESS_ID,
    ARNS_PROCESS_ID: ARNS_REGISTRY_PROCESS_ID,
} as const
