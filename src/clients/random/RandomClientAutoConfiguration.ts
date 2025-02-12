import { RandomClientConfig } from "src/clients/random/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids"
import ARIOService from "src/services/ario/ARIOService";
import { DOMAINS } from "src/services/ario/domains";

export const getRandomClientAutoConfiguration = async (): Promise<RandomClientConfig> => ({
    ...getBaseClientAutoConfiguration(),
    processId: await ARIOService.getProcessIdForDomain(DOMAINS.RANDAO_API),
    tokenProcessId: RNG_TOKEN_PROCESS_ID,
});
