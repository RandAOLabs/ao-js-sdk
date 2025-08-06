import { PiPricingService } from './PiPricingService';
import { PROCESS_IDS } from '../../../constants';
import { IPiPricingService } from './abstract';

/**
 * Pre-configured PI Pricing Service instances
 * @category Autonomous Finance
 */

/**
 * Pre-configured PI Pricing Service for the main PI process
 */
export const MainPiPricingService: IPiPricingService = PiPricingService.autoConfiguration(PROCESS_IDS.AUTONOMOUS_FINANCE.PI_TOKEN_PROCESS_ID);
