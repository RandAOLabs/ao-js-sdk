import { BaseClientConfig } from "../../../../core";

export interface RedemptionClientConfig extends BaseClientConfig {
}

export interface ViewRedeemedCodesResponse {
	codes: RedemptionCodeInfo[];
}

export interface RedemptionCodeInfo {
	code: string;
	redeemed: boolean;
	redeemedBy: string;
	timestamp: number;
	lastUpdatedBy: string;
	lastUpdatedAt: number;
}