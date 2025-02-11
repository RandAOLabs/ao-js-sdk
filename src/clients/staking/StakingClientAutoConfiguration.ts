import { StakingClientConfig } from "src/clients/staking/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";

import { STAKING_PROCESS_ID, STAKING_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getStakingClientAutoConfiguration = (): StakingClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: STAKING_PROCESS_ID,
    tokenProcessId: STAKING_TOKEN_PROCESS_ID,
});
