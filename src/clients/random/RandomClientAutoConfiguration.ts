import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "NlHgeFYslkUhiOdF1JcbTC9nkxFkwCJs8wjd2sBTjf8",
    tokenProcessId: "OeX1V1xSabUzUtNykWgu9GEaXqacBZawtK12_q5gXaA",
});