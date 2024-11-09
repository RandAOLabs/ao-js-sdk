import { TokenClientConfig } from "../token/abstract/TokenClientConfig";
import { BASE_CLIENT_AUTO_CONFIGURATION } from "../../core/BaseClientAutoConfiguration";

export const RANDOM_CLIENT_AUTO_CONFIGURATION: TokenClientConfig = {
    ...BASE_CLIENT_AUTO_CONFIGURATION,
    processId: "RANDOM CLIENT AUTO CONFIG FAKE PROCESS ID",
}