export const RNG_TOKEN_PROCESS_ID: string = "yKVS1tYE3MajUpZqEIORmW1J8HTke-6o6o6tnlkFOZQ"
export const RANDOM_PROCESS_ID: string = "KbaY8P4h9wdHYKHlBSLbXN_yd-9gxUDxSgBackUxTiQ"

export const STAKING_PROCESS_ID: string = RNG_TOKEN_PROCESS_ID
export const STAKING_TOKEN_PROCESS_ID: string = "5ZR9uegKoEhE9fJMbs-MvWLIztMNCVxgpzfeBVE3vqI"

export const NFT_SALE_PROCESS_ID: string = "ewO-sg8QM8xK_yM_ERzvbOZ4DCbTGoBK51uZnc3MENw"
export const ARCAO_TEST_TOKEN_PROCESS_ID: string = STAKING_TOKEN_PROCESS_ID
export const ARCAO_TEST_NFT_COLLECTION: string = "Kvrlp7PFbtxLohR8g5PKYRzKccAsK09cpAWqGLLL_1M"

/*In theory these never need to change*/
export const PROFILE_REGISTRY_PROCESS_ID: string = "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY"
export const WRAPPED_AR_TOKEN_PROCESS_ID: string = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"
export const Q_ARWEAVE_TOKEN_PROCESS_ID: string = "NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8"
export const AO_TOKEN_PROCESS_ID: string = "UkS-mdoiG8hcAClhKK8ch4ZhEzla0mCPDOix9hpdSFE"

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
    WRAPPED_AR_TOKEN_PROCESS_ID,
    Q_ARWEAVE_TOKEN_PROCESS_ID,
    AO_TOKEN_PROCESS_ID
} as const
