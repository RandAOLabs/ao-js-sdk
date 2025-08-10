import { IService } from "./abstract/IService";

export class Service implements IService {
	getServiceName(): string {
		return this.constructor.name
	}
}
