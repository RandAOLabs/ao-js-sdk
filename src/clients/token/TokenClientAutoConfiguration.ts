import { TokenClientConfig } from "./abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration, } from "../../core/BaseClientAutoConfiguration";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "W3jdK85h1bFzZ7K_IXd0zLxq4RbpxPi0hvqUW6hAdUY",
});