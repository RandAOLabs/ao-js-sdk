import { RSAKey, TimeLockPuzzle } from "src/clients/randao/random/abstract/types"

/**
 * @inline
 */
export interface CommitParams {
    /**
     * Id of the randomness request to commit to
     */
    requestId: string
    puzzle: TimeLockPuzzle
}

/**
 * @inline
 */
export interface RevealParams {
    /**
     * Id of the randomness request to reveal
     */
    requestId: string
    rsa_key: RSAKey
}