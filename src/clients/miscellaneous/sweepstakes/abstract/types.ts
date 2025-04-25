export interface SweepstakesPull {
    CallbackId: string;
    Details: string;
    Winner?: string;
    Id: number;
}

export interface SweepstakesData {
    Entries: string[];
	PullCount: number;
	EntryCount: number;
	Creator: string;
	Pulls: SweepstakesPull[];
	Details?: string;
}

export interface ViewAllSweepstakesResponse {
    sweepstakes: SweepstakesData[];
}

export type ViewOneSweepstakesResponse = SweepstakesData;
