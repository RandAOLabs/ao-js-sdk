import { getBaseClientAutoConfiguration } from "../../../core/ao/BaseClientAutoConfiguration";
import { StakingClientConfig } from "./abstract/StakingClientConfig";
import { STAKING_PROCESS_ID, STAKING_TOKEN_PROCESS_ID } from "../../../processes_ids";

export const getStakingClientAutoConfiguration = (): StakingClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: STAKING_PROCESS_ID,
    tokenProcessId: STAKING_TOKEN_PROCESS_ID,
});
