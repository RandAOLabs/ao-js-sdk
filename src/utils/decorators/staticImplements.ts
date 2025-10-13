/**
 * A class decorator for indicating that a class implements an interface statically
 */
export function staticImplements<T>(): <U extends T>(constructor: U) => U {
	return <U extends T>(constructor: U) => constructor;
}
