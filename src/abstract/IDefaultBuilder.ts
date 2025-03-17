import { BaseClient } from "src/core/ao/BaseClient";
import { IBuilder } from "./IBuilder";

export interface IDefaultBuilder<T extends BaseClient>{
    /**
     * @returns a builder with nice preset defaults
     */
    defaultBuilder(): IBuilder<T>;
}