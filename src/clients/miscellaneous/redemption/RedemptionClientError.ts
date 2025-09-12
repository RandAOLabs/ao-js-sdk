// RaffleClientError.ts
export class RaffleClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'RaffleClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}


export class ViewPullError extends RaffleClientError {
    constructor(originalError?: Error) {
        super('Error viewing raffle pull', originalError);
        this.name = 'ViewPullError';
    }
}
