export class AOSuspectedRateLimitingError extends Error {
    constructor(originalError: Error, details?: any) {
        super(`It appears you are being ratelimited...possibly. Try waiting or using another entry point to ao? The original Error was: ${originalError.name}, ${originalError.message} | Dryrun details: ${JSON.stringify(details)}`);
        this.name = 'AOSuspectedRateLimitingError';
    }
}
