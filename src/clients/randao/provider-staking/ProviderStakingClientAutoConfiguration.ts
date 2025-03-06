import { StakingClientConfig } from "src/clients";
import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";

import { RANDAO_STAKING_TOKEN_PROCESS_ID, RANDAO_PROFILE_PROCESS_ID } from "src/processes_ids";

export const getProviderStakingClientAutoConfiguration = (): StakingClientConfig => {
    const builder = new TokenInterfacingClientConfigBuilder()
    return builder
        .withProcessId(RANDAO_PROFILE_PROCESS_ID)
        .withTokenProcessId(RANDAO_STAKING_TOKEN_PROCESS_ID)
        .build()
}