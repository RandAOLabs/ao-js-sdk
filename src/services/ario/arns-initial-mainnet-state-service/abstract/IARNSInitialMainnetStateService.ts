import { IService } from "../../../common";
import { IMainnetInitialState } from "./IMainnetInitialState";

export interface IARNSInitialMainnetStateService extends IService {
	/**
	 * Get mainnet initial state events for a specific name
	 * @param name The name to get events for
	 * @returns Observable of mainnet initial state events
	 */
	getMainnetInitialState(name: string): IMainnetInitialState | undefined;
}
