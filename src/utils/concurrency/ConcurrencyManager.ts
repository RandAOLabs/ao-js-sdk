import { Logger } from "../logger";
import pLimit from 'p-limit';
import pRetry, { FailedAttemptError, Options as PRetryOptions } from "p-retry";

export interface RetryOptions {
    retries?: number;
    onFailedAttempt?: (error: { attemptNumber: number; retriesLeft: number; message: string }) => void;
}

// Convert our options to p-retry options
function toPRetryOptions(options: RetryOptions): PRetryOptions {
    return {
        // @ts-ignore - p-retry's types are incorrect, it does accept retries // Double Verified
        retries: options.retries ?? 3,
        onFailedAttempt: (error: FailedAttemptError) => {
            const message = `Operation failed. Attempt ${error.attemptNumber}/${(options.retries ?? 3) + 1}. ${error.message}`;
            Logger.warn(message);

            if (options.onFailedAttempt) {
                options.onFailedAttempt({
                    attemptNumber: error.attemptNumber,
                    retriesLeft: error.retriesLeft,
                    message: error.message
                });
            }
        }
    };
}

/**
 * Manages concurrent operations with retry capabilities using p-limit and p-retry
 * @category Utility
 */
export class ConcurrencyManager {
    private static instance: ConcurrencyManager;
    private readonly limit: ReturnType<typeof pLimit>;

    private constructor(maxConcurrent: number = 50) {
        this.limit = pLimit(maxConcurrent);
    }

    public static getInstance(): ConcurrencyManager {
        if (!ConcurrencyManager.instance) {
            ConcurrencyManager.instance = new ConcurrencyManager();
        }
        return ConcurrencyManager.instance;
    }

    /**
     * Executes an operation with retry capability
     * @param operation Function to execute
     * @param options Retry options
     */
    public async executeWithRetry<T>(
        operation: () => Promise<T>,
        options: RetryOptions = { retries: 3 }
    ): Promise<T | null> {
        try {
            return await this.limit(() =>
                pRetry(
                    async (_attemptCount) => operation(),
                    toPRetryOptions(options)
                )
            );
        } catch (error: any) {
            Logger.warn(`Operation failed after all retries: ${error.message}`);
            return null;
        }
    }

    /**
     * Executes multiple operations concurrently with retry capability
     * @param operations Array of operations to execute
     * @param options Retry options
     */
    public async executeAllWithRetry<T>(
        operations: Array<() => Promise<T>>,
        options: RetryOptions = { retries: 3 }
    ): Promise<(T | null)[]> {
        return Promise.all(
            operations.map(operation => this.executeWithRetry(operation, options))
        );
    }
}

// Export singleton instance
export default ConcurrencyManager.getInstance();
