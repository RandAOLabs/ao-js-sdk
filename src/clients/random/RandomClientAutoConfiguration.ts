import { RandomClientConfig } from "src/clients/random/abstract";
import { RANDAO_API_ARNS_NAME } from "src/clients/random/constants";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids"
import ARIOService from "src/services/ario/ARIOService";

export const getRandomClientAutoConfiguration = async (): Promise<RandomClientConfig> => ({
    ...getBaseClientAutoConfiguration(),
    processId: await ARIOService.getProcessIdForDomain(RANDAO_API_ARNS_NAME),
    tokenProcessId: RNG_TOKEN_PROCESS_ID,
});