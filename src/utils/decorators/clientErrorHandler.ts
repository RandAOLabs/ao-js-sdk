import { ClientError } from '../../common/error/client-error';

/**
 * Decorator that wraps client methods with error handling, converting any thrown errors into ClientError instances
 * @param target The client class instance
 * @param propertyKey The method name
 * @param descriptor The method descriptor
 */
export function ClientErrorHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
	if (!descriptor || typeof descriptor.value !== 'function') {
		return
	}

	const originalMethod = descriptor.value;

	descriptor.value = function (this: any, ...args: any[]) {
		const params = args.length > 0 ? args : undefined;

		try {
			const result = originalMethod.apply(this, args);

			// Handle async methods
			if (result && typeof result.then === 'function') {
				return result.catch((error: any) => {
					throw new ClientError(
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
			throw new ClientError(
				this,
				originalMethod,
				params,
				error instanceof Error ? error : new Error(String(error))
			);
		}
	};

	// Don't return anything - we modified descriptor in place
}
