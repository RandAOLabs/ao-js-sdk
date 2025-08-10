import { PortfolioService } from './PortfolioService';
import { IPortfolioService } from './abstract';

/**
 * Pre-configured Portfolio Service instances
 * @category Portfolio
 */

/**
 * Pre-configured Portfolio Service instance
 */
export const MainPortfolioService: IPortfolioService = PortfolioService.autoConfiguration();
