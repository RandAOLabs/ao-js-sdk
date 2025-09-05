import { Observable, of } from "rxjs";
import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IMainnetInitialState } from "./abstract/IMainnetInitialState";
import { MainnetInitialState } from "./MainnetInitialStateEvent";
import { getPreMainnetData } from "./data/pre-mainnet-data";
import { IService } from "../../common";
import { ServiceErrorHandler } from "../../../utils/decorators/serviceErrorHandler";
import { IARNSInitialMainnetStateService } from "./abstract/IARNSInitialMainnetStateService";

/**
 * Service for handling ARNS initial mainnet state data and events
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARNSInitialMainnetStateService implements IARNSInitialMainnetStateService, IService {
	constructor() { }

	/**
	 * Creates a pre-configured instance of ARNSInitialMainnetStateService
	 * @returns A pre-configured ARNSInitialMainnetStateService instance
	 */
	public static autoConfiguration(): IARNSInitialMainnetStateService {
		return new ARNSInitialMainnetStateService();
	}

	public getServiceName(): string {
		return 'ARNSInitialMainnetStateService';
	}

	@ServiceErrorHandler
	public getMainnetInitialState(name: string): IMainnetInitialState | undefined {
		const preMainnetData = getPreMainnetData(name);
		if (preMainnetData) {
			const event = new MainnetInitialState(preMainnetData);
			return event;
		}
		return undefined;
	}
}
