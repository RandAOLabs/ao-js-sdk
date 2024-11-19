import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "XgUoOWcsHDwibQCWoAdii3hw1sFh2sCExeGnVZsnzoo",
    tokenProcessId: "OeX1V1xSabUzUtNykWgu9GEaXqacBZawtK12_q5gXaA",
});