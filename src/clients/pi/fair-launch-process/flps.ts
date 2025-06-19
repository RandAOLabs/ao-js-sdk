import { FairLaunchProcessClient } from "./FairLaunchProcessClient";
import { AUTONOMOUS_FINANCE } from "../../../process-ids/autonomous-finance";


/**
 * Pre-configured client for the Apus Fair Launch Process
 */
export const ApusFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.APUS)

/**
 * Pre-configured client for the Botega Fair Launch Process
 */
export const BotegaFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.BOTEGA)

/**
 * Pre-configured client for the Action Fair Launch Process
 */
export const ActionFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.ACTION)

/**
 * Pre-configured client for the Protocol Land Fair Launch Process
 */
export const ProtocolLandFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.PROTOCOL_LAND)

/**
 * Pre-configured client for the Ario Fair Launch Process
 */
export const ArioFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.ARIO)

/**
 * Pre-configured client for the Pixl Fair Launch Process
 */
export const PixlFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.PIXL)

/**
 * Pre-configured client for the Game Fair Launch Process
 */
export const GameFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.GAME)

/**
 * Pre-configured client for the SMoney Fair Launch Process
 */
export const SMoneyFLP = FairLaunchProcessClient.from(AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.SMONEY)
