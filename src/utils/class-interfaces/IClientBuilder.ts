import { IBuilder } from "./builder/IBuilder";

export interface IClassBuilder {
	/**
	 * @returns a builder for the class
	 */
	builder(): IBuilder<any> | Promise<IBuilder<any>>;
}
