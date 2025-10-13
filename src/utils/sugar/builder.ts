import { IBuilder } from "../class-interfaces";

export function builder<T extends object>(): IBuilder<T> {
	const draft: Partial<T> = {};
	let allowDefaultsFlag = false;

	const resetDraft = () => {
		Object.keys(draft).forEach(key => delete (draft as any)[key]);
	};

	const handler: ProxyHandler<any> = {
		get(_, prop: string) {
			if (prop === "build") return () => draft as T;
			if (prop === "reset") {
				return () => {
					resetDraft();
					allowDefaultsFlag = false;
					return proxy;
				};
			}
			if (prop === "allowDefaults") {
				return (allow: boolean) => {
					allowDefaultsFlag = allow;
					return proxy;
				};
			}
			if (prop.startsWith("with")) {
				const key = (prop.slice(4, 5).toLowerCase() + prop.slice(5)) as keyof T;
				return (val: T[typeof key]) => { (draft as any)[key] = val; return proxy; };
			}
			throw new Error(`Unknown method: ${prop}`);
		}
	};
	const proxy = new Proxy({}, handler) as any as IBuilder<T>;
	return proxy;
}
