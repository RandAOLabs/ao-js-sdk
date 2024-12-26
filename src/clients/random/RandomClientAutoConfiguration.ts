import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "-3Nvdg7g9S7ly-2scR8TtcY3QmIwtl_Gx5PDREJssiA",
    tokenProcessId: "W3jdK85h1bFzZ7K_IXd0zLxq4RbpxPi0hvqUW6hAdUY",
});