import { StakingClientConfig } from "src/clients/staking/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

import { RANDAO_STAKING_TOKEN_PROCESS_ID, RANDAO_STAKING_PROCESS_ID } from "src/processes_ids";

export const getProviderStakingClientAutoConfiguration = (): StakingClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RANDAO_STAKING_PROCESS_ID,
    tokenProcessId: RANDAO_STAKING_TOKEN_PROCESS_ID,
});
