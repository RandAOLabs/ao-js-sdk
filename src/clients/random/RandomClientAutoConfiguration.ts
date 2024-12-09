import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "-3Nvdg7g9S7ly-2scR8TtcY3QmIwtl_Gx5PDREJssiA",
    tokenProcessId: "OeX1V1xSabUzUtNykWgu9GEaXqacBZawtK12_q5gXaA",
});