
// RandomClientError.ts
export class RandomClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'RandomClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class ProviderAvailableValuesError extends RandomClientError {
    constructor(originalError?: Error) {
        super(`Error retrieving provider's available values`, originalError);
        this.name = 'ProviderAvailableValuesError';
    }
}

export class UpdateProviderAvailableValuesError extends RandomClientError {
    constructor(originalError?: Error) {
        super(`Error updating provider's available values`, originalError);
        this.name = 'UpdateProviderAvailableValuesError';
    }
}

export class OpenRandomRequestsError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error retrieving open random requests', originalError);
        this.name = 'OpenRandomRequestsError';
    }
}

export class RandomRequestsError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error retrieving random requests', originalError);
        this.name = 'RandomRequestsError';
    }
}

export class PostVDFChallengeError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error posting VDF challenge', originalError);
        this.name = 'PostVDFChallengeError';
    }
}

export class CreateRequestError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error creating request', originalError);
        this.name = 'CreateRequestError';
    }
}

export class PostVDFOutputAndProofError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error posting VDF output and proof', originalError);
        this.name = 'PostVDFOutputAndProofError';
    }
}

export class GetAllProviderActivityError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error Getting all provider activity', originalError);
        this.name = 'GetAllProviderActivityError';
    }
}


export class GetProviderActivityError extends RandomClientError {
    constructor(originalError?: Error) {
        super('Error getting provider activity', originalError);
        this.name = 'GetAllProviderActivityError';
    }
}