import { Environment } from "../environment";
import { LogLevel } from "./types";

export type LogLevelConfig = Record<Environment, LogLevel>;

/**
 * @category Utility
 */
export const DEFAULT_LOG_LEVELS: LogLevelConfig = {
    [Environment.NODE]: LogLevel.INFO,
    [Environment.BROWSER]: LogLevel.ERROR,
};
