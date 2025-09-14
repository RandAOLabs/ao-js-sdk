import { FLPDataService } from './FLPDataService';
import { PROCESS_IDS } from '../../../constants';
import { IFLPDataService } from './abstract';

/**
 * Pre-configured FLP Data Service instances for different Fair Launch Processes
 * @category Autonomous Finance
 */

/**
 * Pre-configured FLP Data Service for the Game Fair Launch Process
 */
export const GameFLPDataService: IFLPDataService = FLPDataService.autoConfiguration(PROCESS_IDS.AUTONOMOUS_FINANCE.FAIR_LAUNCH_PROCESSES.GAME);
