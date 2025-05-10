import { BaseClient } from "src/core/ao/BaseClient";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { getWalletLazy } from "src/utils";
import { IProcessClient } from "../../../src/core/ao/abstract";

/**
 * Mock implementation of BaseClient for testing.
 * Allows setting return values for any BaseClient method and binding to any client.
 */
export class MockBaseClient extends BaseClient {
	// Define types for mock responses
	private mockResponses: {
		getFirstMessageDataJson?: any;
		dryrun?: DryRunResult;
		messageResult?: MessageResult;
		message?: string
	} = {};

	constructor() {
		// Use a mock wallet instead of trying to load a real one
		const mockWallet = {
			kty: 'RSA',
			e: 'AQAB',
			n: 'mockKey',
			d: 'mockKey'
		};

		super({
			processId: "mock-process-id",
			wallet: mockWallet
		});
	}

	/**
	 * Set mock response for dryrun
	 */
	setMockDryrun(response: DryRunResult) {
		this.mockResponses.dryrun = response;
	}

	/**
	 * Set mock response for messageResult
	 */
	setMockMessageResult(response: MessageResult) {
		this.mockResponses.messageResult = response;
	}

	/**
	 * Set mock response for messageResult
	 */
	setMockMessage(messageId: string) {
		this.mockResponses.message = messageId;
	}
	/**
	 * Clear all mock responses
	 */
	clearMockResponses() {
		this.mockResponses = {};
	}

	async dryrun(): Promise<DryRunResult> {
		return this.mockResponses.dryrun || {
			Messages: [{ Tags: [] }],
			Output: "",
			Spawns: []
		};
	}

	async messageResult(): Promise<MessageResult> {
		return this.mockResponses.messageResult || {
			Messages: [{ Tags: [] }],
			Output: "",
			Spawns: []
		};
	}

	async message(): Promise<string> {
		return this.mockResponses.message!
	}

	/**
	 * Bind all BaseClient methods from this mock to a client instance
	 * @param client Client instance to bind methods to
	 */
	bindToClient(client: IProcessClient) {
		const mockMethods = {
			dryrun: this.dryrun.bind(this),
			messageResult: this.messageResult.bind(this),
			message: this.message.bind(this),
		};

		// Use type assertion to bind methods
		Object.assign(client, mockMethods);
	}
}
