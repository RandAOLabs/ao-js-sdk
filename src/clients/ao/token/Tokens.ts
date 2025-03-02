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
const NUMBER_ALWAYS_BIGGER = "OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU";

/**
 * TRUNK process ID
 */
const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ";

// Export all tokens in a single namespace
export const Tokens = {
    RUNE_REALM: RuneRealmTokens,
    NUMBER_ALWAYS_BIGGER,
    TRUNK
} as const;
