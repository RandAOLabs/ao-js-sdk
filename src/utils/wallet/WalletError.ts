
export class WalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
}

export class FileReadError extends WalletError {
    constructor(filePath: string, originalError: string) {
        super(`Failed to read wallet file at ${filePath}: ${originalError}`);
        this.name = 'FileReadError';
    }
}

export class BrowserWalletError extends WalletError {
    constructor() {
        super('Arweave wallet is not available in the browser context');
        this.name = 'BrowserWalletError';
    }
}
