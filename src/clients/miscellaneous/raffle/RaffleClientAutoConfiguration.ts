import { RaffleClientConfig } from "src/clients";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { RAFFLE_PROCESS_ID } from "src/processes_ids";

export const getRaffleClientAutoConfiguration = (): RaffleClientConfig => {
    const builder = new BaseClientConfigBuilder()
    return builder
        .withProcessId(RAFFLE_PROCESS_ID)
        .build()
}