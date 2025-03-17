import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";
import { RandomClientConfig } from "src/clients/randao/random/abstract";
import { RandomClientConfigBuilder } from "src/clients/randao/random/RandomClientConfigBuilder";


/**
 * 
 * @deprecated 
 */
export const getRandomClientAutoConfiguration = async (): Promise<RandomClientConfig> => {
    const builder = new RandomClientConfigBuilder()
    return await builder
        .build()
}