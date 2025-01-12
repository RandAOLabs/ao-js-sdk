import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "KbaY8P4h9wdHYKHlBSLbXN_yd-9gxUDxSgBackUxTiQ",
    tokenProcessId: "7enZBOhWsyU3A5oCt8HtMNNPHSxXYJVTlOGOetR9IDw",
});