import { Tags } from "src/core";

export type BalanceResponse = {
    Tags: {
        Balance: string;
        Target: string;
        Ticker: string;
    };
};

export type BalanceParams = {
    identifier?: string;
};

export type BalancesParams = {
    limit?: number;
    cursor?: string;
};

export type TransferParams = {
    recipient: string;
    quantity: string;
    forwardedTags?: Tags;
};

export type GetInfoParams = {
    token: string;
};

export type MintParams = {
    quantity: string;
};

export type GrantParams = {
    quantity: string;
    recipient?: string;
};
