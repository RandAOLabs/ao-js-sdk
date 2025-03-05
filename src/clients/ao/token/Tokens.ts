/**
 * RuneRealm related process IDs
 */
const RuneRealmTokens = {
    // Berries
    AIR_BERRIES: "XJjSdWaorbQ2q0YkaQSmylmuADWH1fh2PvgfdLmXlzA",
    ROCK_BERRIES: "2NoNsZNyHMWOzTqeQUJW9Xvcga3iTonocFIsgkWIiPM",
    FIRE_BERRIES: "30cPTQXrHN76YZ3bLfNAePIEYDb5Xo1XnbQ-xmLMOM0",
    WATER_BERRIES: "twFZ4HTvL_0XAIOMPizxs_S3YH5J5yGvJ8zKiMReWF0",

    // Base Token
    RUNE: "4sKr4cf3kvbzFyhM6HmUsYG_Jz9bFZoNUrUX5KoVe0Q",

    // Gems
    RUBY: "rNVB_bYcNLk6OgcbyG8MEmxjGo76oj3gFzLBCWOhqXI",
    TOPAZ: "R5UGOfFboMv-zlaSSDgRqxRILmGgPPe5BlnPf5F4i3A",
    EMERALD: "C19KuCwx1VRH4WItj9wYUu1DIkdvareU3aMmojVZJf4"
} as const;

/**
 * Number Always Bigger process ID
 */
const NUMBER_ALWAYS_BIGGER: string = "OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU";

/**
 * TRUNK process ID
 */
const TRUNK: string = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ";

/**
 * Wrapped AR (wAR) process ID
 */
const WRAPPED_ARWEAVE: string = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10";

/**
 * Quantom AR (qAR) process ID
 */
const QUANTOM_ARWEAVE: string = "NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8"

/**
 * AO Token process ID
 */
const AO: string = "UkS-mdoiG8hcAClhKK8ch4ZhEzla0mCPDOix9hpdSFE"



// Export all tokens in a single namespace
export const TOKENS = {
    RUNE_REALM: RuneRealmTokens,
    NUMBER_ALWAYS_BIGGER,
    WRAPPED_ARWEAVE,
    QUANTOM_ARWEAVE,
    AO,
    TRUNK
} as const;
