export class EnvironmentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnvironmentError';
    }
}

export class EnvironmentVariableError extends EnvironmentError {
    constructor(variableName: string) {
        super(`${variableName} environment variable is not set`);
        this.name = 'EnvironmentVariableError';
    }
}

export class UnknownEnvironmentError extends EnvironmentError {
    constructor() {
        super('Unknown environment');
        this.name = 'UnknownEnvironmentError';
    }
}