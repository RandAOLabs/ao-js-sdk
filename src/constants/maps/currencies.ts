import { EntityId } from "../../models/entity/abstract/EntityType";
import { PROCESS_IDS } from "../processIds";
import { CurrencyMap } from "./types";

/**
 * @category ARIO
 */
export const ARIO_TOKEN: CurrencyMap = {
	name: "ARIO",
	tokenProcessId: PROCESS_IDS.ARCAO.GAME_TOKEN,
	decimals: 18
}

export const AO_TOKEN: CurrencyMap = {
	name: "AO",
	tokenProcessId: PROCESS_IDS.AO,
	decimals: 12
}

const currencyMaps: CurrencyMap[] = [
	AO_TOKEN,
	ARIO_TOKEN
]


export function getCurrencyMap(processId: EntityId): CurrencyMap | undefined {
	return currencyMaps.filter((map: CurrencyMap) => map.tokenProcessId == processId)[0]
}
