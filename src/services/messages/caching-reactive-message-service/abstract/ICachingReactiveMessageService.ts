import { IReactiveMessageService } from '../../reactive-message-service/abstract/IReactiveMessageService';

/**
 * Interface for caching reactive message service
 */
export interface ICachingReactiveMessageService extends IReactiveMessageService {
	// Inherits all methods from IReactiveMessageService
	// No additional methods needed for the caching wrapper
}
