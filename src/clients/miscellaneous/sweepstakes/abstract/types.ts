export interface SweepstakesPull {
    CallbackId: string;
    User: string;
    Winner?: string;
    Id: number;
}

export interface ViewSweepstakesPullsResponse {
    pulls: SweepstakesPull[];
}

export type ViewSweepstakesEntrantsResponse = string[];

export type ViewSweepstakesOwnersResponse = string[];
