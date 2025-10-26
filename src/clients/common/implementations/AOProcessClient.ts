import { AOProcessClientConfig } from "../abstract";
import { IAOProcessClient } from "../abstract/IAOProcessClient";

export class AOProcessClient implements IAOProcessClient {
	private processId: string;
	protected constructor(config: AOProcessClientConfig) {
		this.processId = config.processId;
	}
	public setProcessId(processId: string): void {
		this.processId = processId;
	}
	public getProcessId(): string {
		return this.processId
	}
}
