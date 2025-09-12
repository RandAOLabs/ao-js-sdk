import { DryRunResult, MessageResult } from "../../../../../src/core/ao/abstract";
import { ARNSRecord } from "../../../../../src/clients/ario/arns/types";
import { GetArNSRecordsResponse } from "../../../../../src/clients/ario/arns/abstract/responseTypes";

export const mockArnsRecord: ARNSRecord = {
	name: "test_ant",
	processId: "test-process-id",
	metadata: {
		owner: "test-owner",
		controller: "test-controller"
	}
};

export const mockArnsRecordsResponse: GetArNSRecordsResponse = {
	limit: 100,
	totalItems: 2,
	hasMore: false,
	nextCursor: "test-cursor",
	items: [
		{
			startTimestamp: 1757623792062,
			name: "test-name-1",
			purchasePrice: 8412875000,
			type: "permabuy",
			undernameLimit: 10,
			processId: "test-process-id-1"
		},
		{
			startTimestamp: 1757623792063,
			name: "test-name-2",
			purchasePrice: 5000000000,
			type: "lease",
			undernameLimit: 5,
			processId: "test-process-id-2"
		}
	],
	sortOrder: "desc",
	sortBy: "startTimestamp"
};

export const messageResult: MessageResult = {
	Output: undefined,
	Messages: [{ Data: "200: Success", Tags: [] }],
	Spawns: []
};

export const dryRunResult: DryRunResult = {
	Output: undefined,
	Messages: [{ Data: JSON.stringify(mockArnsRecord), Tags: [] }],
	Spawns: []
};

export const dryRunResultRecords: DryRunResult = {
	Output: undefined,
	Messages: [{ Data: JSON.stringify(mockArnsRecordsResponse), Tags: [] }],
	Spawns: []
};
