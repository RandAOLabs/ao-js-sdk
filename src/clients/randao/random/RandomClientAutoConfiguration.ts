import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";
import { RandomClientConfig } from "src/clients/randao/random/abstract";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids"
import { ARIOService } from "src/services/ario/ARIOService";
import { Domain } from "src/services/ario/domains";

export const getRandomClientAutoConfiguration = async (): Promise<RandomClientConfig> => {
    const builder = new TokenInterfacingClientConfigBuilder()
    const processId = await ARIOService.getInstance().getProcessIdForDomain(Domain.RANDAO_API)
    return builder
        .withProcessId(processId)
        .withTokenProcessId(RNG_TOKEN_PROCESS_ID)
        .build()
}