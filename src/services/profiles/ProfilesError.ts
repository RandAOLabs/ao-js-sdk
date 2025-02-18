/**
 * Base error class for Profiles service errors
 */
export class ProfilesError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProfilesError';
    }
}

/**
 * Error thrown when profile info cannot be retrieved
 */
export class ProfileInfoRetrievalError extends ProfilesError {
    constructor(identifier: string, cause?: Error) {
        super(`Failed to retrieve profile info for identifier: ${identifier}${cause ? `. Cause: ${cause.message}` : ''}`);
        this.name = 'ProfileInfoRetrievalError';
    }
}
