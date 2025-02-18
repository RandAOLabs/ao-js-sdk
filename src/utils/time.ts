import { Logger } from "src/utils/logger";
/**
 * Pauses execution for the specified number of seconds
 * @param seconds Number of seconds to sleep
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (seconds: number): Promise<void> => {
    Logger.info(`Sleeping for ${seconds} seconds.`)
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
