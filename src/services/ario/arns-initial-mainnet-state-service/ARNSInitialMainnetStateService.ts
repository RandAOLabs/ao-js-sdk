import { staticImplements, IAutoconfiguration } from "../../../utils";
import { IMainnetInitialState } from "./abstract/IMainnetInitialState";
import { MainnetInitialState } from "./MainnetInitialStateEvent";
import { getPreMainnetData } from "./data/pre-mainnet-data";
import { IService, Service } from "../../common";
import { IARNSInitialMainnetStateService } from "./abstract/IARNSInitialMainnetStateService";

/**
 * Service for handling ARNS initial mainnet state data and events
 * @category ARIO
 */
@staticImplements<IAutoconfiguration>()
export class ARNSInitialMainnetStateService extends Service implements IARNSInitialMainnetStateService, IService {
	constructor() {
		super()
	}

	/**
	 * Creates a pre-configured instance of ARNSInitialMainnetStateService
	 * @returns A pre-configured ARNSInitialMainnetStateService instance
	 */
	public static autoConfiguration(): IARNSInitialMainnetStateService {
		return new ARNSInitialMainnetStateService();
	}

	public getMainnetInitialState(name: string): IMainnetInitialState | undefined {
		const preMainnetData = getPreMainnetData(name);
		if (preMainnetData) {
			const event = new MainnetInitialState(preMainnetData);
			return event;
		}
		return undefined;
	}
}
