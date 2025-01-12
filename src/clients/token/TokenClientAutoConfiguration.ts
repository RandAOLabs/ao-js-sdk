import { TokenClientConfig } from "./abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration, } from "../../core/BaseClientAutoConfiguration";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "7enZBOhWsyU3A5oCt8HtMNNPHSxXYJVTlOGOetR9IDw",
});