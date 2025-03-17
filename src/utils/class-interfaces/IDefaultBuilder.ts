import { IBuilder } from "./IBuilder";
import { UnimplementedError } from "../errors";

export abstract class IDefaultBuilder {
    /**
     * @returns a builder with nice preset defaults
     */
    public static defaultBuilder<T extends IDefaultBuilder>(): IBuilder<T> {
        throw new UnimplementedError('defaultBuilder', this.name)
    }
}