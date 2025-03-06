import { BaseClientConfig } from "src/core";

export interface RaffleClientConfig extends BaseClientConfig {
}

export interface RafflePull {
    CallbackId: string;
    User: string;
    Winner?: string;
    Id: number;
}

export interface ViewPullsResponse {
    pulls: RafflePull[];
}

export type ViewEntrantsResponse = string[];

export type ViewRaffleOwnersResponse = string[];
