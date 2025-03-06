/**
 * Error thrown when an abstract/interface method that should be implemented by a subclass is not implemented.
 */
export class UnimplementedError extends Error {
    /**
     * Creates a new UnimplementedError.
     * @param methodName The name of the unimplemented method
     * @param className Optional name of the class that should implement the method
     */
    constructor(methodName: string, className?: string) {
        const message = className
            ? `Method '${methodName}' is not implemented. Class '${className}' should provide an implementation.`
            : `Method '${methodName}' is not implemented. A subclass should provide an implementation.`;

        super(message);
        this.name = 'UnimplementedError';
    }
}
