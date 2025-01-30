import type { Tag, Message, Environment, HandleResponse, handleFunction, BinaryFormat, Options } from "@permaweb/ao-loader";

export type { Tag, Message, Environment, HandleResponse, handleFunction };

/**
 * Extended options interface that includes all possible configuration
 */
export interface AoLoaderOptions extends Options {
    format: BinaryFormat;
    inputEncoding: string;
    outputEncoding: string;
    memoryLimit: string;
    computeLimit: number;
    extensions: string[];
}

/**
 * Default options for AO loader
 */
export const DEFAULT_OPTIONS: AoLoaderOptions = {
    format: "wasm32-unknown-emscripten2",
    inputEncoding: "JSON-1",
    outputEncoding: "JSON-1",
    memoryLimit: "524288000",
    computeLimit: 9e12,
    extensions: []
};
