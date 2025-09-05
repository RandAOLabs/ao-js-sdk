import { IMainnetInitialState } from "./IMainnetInitialState";

export interface IARNSInitialMainnetStateService {
	/**
	 * Get mainnet initial state events for a specific name
	 * @param name The name to get events for
	 * @returns Observable of mainnet initial state events
	 */
	getMainnetInitialState(name: string): IMainnetInitialState | undefined;
}
