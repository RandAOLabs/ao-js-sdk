import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "vgH7EXVs6-vxxilja6lkBruHlgOkyqddFVg-BVp3eJc",
    tokenProcessId: "W3jdK85h1bFzZ7K_IXd0zLxq4RbpxPi0hvqUW6hAdUY",
});