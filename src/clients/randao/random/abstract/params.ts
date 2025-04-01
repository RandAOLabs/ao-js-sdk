import { RSAKey, TimeLockPuzzle } from "./types"

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