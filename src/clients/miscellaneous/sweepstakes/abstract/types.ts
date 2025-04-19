import { BaseClientConfig } from "../../../../core";

export interface SweepstakesClientConfig extends BaseClientConfig {
}

export interface SweepstakesPull {
    CallbackId: string;
    User: string;
    Winner?: string;
    Id: number;
}

export interface ViewPullsResponse {
    pulls: SweepstakesPull[];
}

export type ViewEntrantsResponse = string[];

export type ViewSweepstakesOwnersResponse = string[];
