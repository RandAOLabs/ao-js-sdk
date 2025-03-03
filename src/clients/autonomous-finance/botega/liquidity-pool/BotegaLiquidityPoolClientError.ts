// BotegaLiquidityPoolClientError.ts
export class BotegaLiquidityPoolClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'BotegaLiquidityPoolClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class GetLPInfoError extends BotegaLiquidityPoolClientError {
    constructor(originalError?: Error) {
        super('Error fetching liquidity pool info', originalError);
        this.name = 'GetLPInfoError';
    }
}

export class GetPriceError extends BotegaLiquidityPoolClientError {
    constructor(tokenId: string, quantity: string | number, originalError?: Error) {
        super(`Error getting price for ${quantity} of token ${tokenId}`, originalError);
        this.name = 'GetPriceError';
    }
}

export class GetTokenAError extends BotegaLiquidityPoolClientError {
    constructor(originalError?: Error) {
        super('Error getting token A client', originalError);
        this.name = 'GetTokenAError';
    }
}

export class GetTokenBError extends BotegaLiquidityPoolClientError {
    constructor(originalError?: Error) {
        super('Error getting token B client', originalError);
        this.name = 'GetTokenBError';
    }
}

export class GetPriceOfTokenAInTokenBError extends BotegaLiquidityPoolClientError {
    constructor(quantity: string | number, originalError?: Error) {
        super(`Error getting price of ${quantity} token A in token B`, originalError);
        this.name = 'GetPriceOfTokenAInTokenBError';
    }
}

export class GetPriceOfTokenBInTokenAError extends BotegaLiquidityPoolClientError {
    constructor(quantity: string | number, originalError?: Error) {
        super(`Error getting price of ${quantity} token B in token A`, originalError);
        this.name = 'GetPriceOfTokenBInTokenAError';
    }
}
