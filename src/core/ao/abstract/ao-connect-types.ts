import { createDataItemSigner } from "@permaweb/aoconnect";

export type DryRunResult = {
	Output: any;
	Messages: any[];
	Spawns: any[];
	Error?: any;
};
export type MessageResult = {
	Output: any;
	Messages: any[];
	Spawns: any[];
	Error?: any;
};
export type ResultsResponse = {
	pageInfo: PageInfo;
	edges: Edge[];
};
export type PageInfo = {
	hasNextPage: boolean;
};
export type Edge = {
	node: Result;
	cursor: string;
};
export type Result = {
	Output: any;
	Messages: any[];
	Spawns: any[];
	Error?: any;
};
export type ReadResultArgs = {
	/**
	 * - the transaction id of the message
	 */
	message: string;
	/**
	 * - the transaction id of the process that received the message
	 */
	process: string;
};
export type ReadResult = (args: ReadResultArgs) => Promise<MessageResult>;

export type ReadResults = (args: ReadResultsArgs) => Promise<ResultsResponse>;
export type ReadResultsArgs = {
	process: string;
	from?: string;
	to?: string;
	limit?: number;
	sort?: string;
};
export type DryRun = (msg: MessageInput & {
	[x: string]: any;
}) => Promise<DryRunResult>;
export type MessageInput = {
	process: string;
	data?: any;
	tags?: {
		name: string;
		value: string;
	}[];
	anchor?: string;
	Id?: string;
	Owner?: string;
};
export type SendMessageArgs = {
	process: string;
	data?: string;
	tags?: {
		name: string;
		value: string;
	}[];
	anchor?: string;
	signer?: ReturnType<typeof createDataItemSigner>;
};
export type SendMessage = (args: SendMessageArgs) => Promise<string>;
