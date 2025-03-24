import { IBuilder } from "./IBuilder";

export interface IClassBuilder {
    /**
     * @returns a builder for the class
     */
    builder(): IBuilder<any> | Promise<IBuilder<any>>;
}