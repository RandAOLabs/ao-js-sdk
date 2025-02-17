import { DryRunCachingClientConfig, IDryRunCachingClient } from "src/core/ao/abstract";
import { BaseClientConfig } from "src/core/ao/abstract/BaseClientConfig";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { getWalletLazy } from "src/utils";

// Function-based configuration
export const getDryRunCachineClientAutoConfiguration = (): DryRunCachingClientConfig => ({
    ...getBaseClientAutoConfiguration(),
});