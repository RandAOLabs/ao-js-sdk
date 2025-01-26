import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { getTokenClientAutoConfiguration } from "../token";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "KbaY8P4h9wdHYKHlBSLbXN_yd-9gxUDxSgBackUxTiQ",
    tokenProcessId: getTokenClientAutoConfiguration().processId,
});