import { ServiceError } from "../../services/common/ServiceError";
import { IService } from "../../services/common";

/**
 * Decorator that wraps service methods with error handling, converting any thrown errors into ServiceError instances
 * @param target The service class instance
 * @param propertyKey The method name
 * @param descriptor The method descriptor
 */
export function ServiceErrorHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
	if (!descriptor || typeof descriptor.value !== 'function') {
		return
	}

	const originalMethod = descriptor.value;

	descriptor.value = function (this: IService, ...args: any[]) {
		const params = args.length > 0 ? args : undefined;

		try {
			const result = originalMethod.apply(this, args);

			// Handle async methods
			if (result && typeof result.then === 'function') {
				return result.catch((error: any) => {
					throw new ServiceError(
						this,
						originalMethod,
						params,
						error instanceof Error ? error : new Error(String(error))
					);
				});
			}

			// Return result for sync methods
			return result;
		} catch (error) {
			// Handle sync method errors
			throw new ServiceError(
				this,
				originalMethod,
				params,
				error instanceof Error ? error : new Error(String(error))
			);
		}
	};

	// Don't return anything - we modified descriptor in place
}
