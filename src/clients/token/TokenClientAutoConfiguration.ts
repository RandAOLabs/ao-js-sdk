import { TokenClientConfig } from "./abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration, } from "../../core/BaseClientAutoConfiguration";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ",
});