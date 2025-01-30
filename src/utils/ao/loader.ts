import AoLoader from "@permaweb/ao-loader";
import type { Message, Environment, HandleResponse } from "@permaweb/ao-loader";
import { AoLoaderOptions, DEFAULT_OPTIONS } from "./types";
import fs from "fs";

/**
 * Class for loading and handling AO WASM processes
 */
export class AoProcessLoader {
    private readonly options: AoLoaderOptions;
    private handle!: (buffer: ArrayBuffer | null, message: Message, env: Environment) => Promise<HandleResponse>;

    private constructor(options: Partial<AoLoaderOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * Creates an AO process loader from a WASM binary
     * @param wasmBinary - The WASM binary as an ArrayBuffer
     * @param options - Optional loader options
     * @returns Promise<AoProcessLoader>
     */
    public static async fromBinary(wasmBinary: ArrayBuffer, options?: Partial<AoLoaderOptions>): Promise<AoProcessLoader> {
        const loader = new AoProcessLoader(options);
        loader.handle = await AoLoader(wasmBinary, loader.options);
        return loader;
    }

    /**
     * Creates an AO process loader from a WASM file
     * @param filePath - Path to the WASM file
     * @param options - Optional loader options
     * @returns Promise<AoProcessLoader>
     */
    public static async fromFile(filePath: string, options?: Partial<AoLoaderOptions>): Promise<AoProcessLoader> {
        try {
            const wasmBinary = fs.readFileSync(filePath);
            return AoProcessLoader.fromBinary(wasmBinary, options);
        } catch (error) {
            throw new Error(`Failed to load WASM file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Creates an AO process loader by fetching WASM from Arweave
     * @param txId - Arweave transaction ID
     * @param options - Optional loader options
     * @returns Promise<AoProcessLoader>
     */
    public static async fromArweave(txId: string, options?: Partial<AoLoaderOptions>): Promise<AoProcessLoader> {
        try {
            const response = await fetch(`https://arweave.net/${txId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const wasmBinary = await response.arrayBuffer();
            return AoProcessLoader.fromBinary(wasmBinary, options);
        } catch (error) {
            throw new Error(`Failed to fetch WASM from Arweave: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Spawns a new process
     * @param message - Message input for the process
     * @param env - Process environment
     * @returns Promise<HandleResponse>
     */
    public async spawn(message: Message, env: Environment): Promise<HandleResponse> {
        return this.handle(null, message, env);
    }

    /**
     * Sends a message to an existing process
     * @param buffer - Process memory buffer
     * @param message - Message input
     * @param env - Process environment
     * @returns Promise<HandleResponse>
     */
    public async message(buffer: ArrayBuffer | null, message: Message, env: Environment): Promise<HandleResponse> {
        return this.handle(buffer, message, env);
    }

    /**
     * Performs a dry run of a message without persisting the result
     * @param buffer - Process memory buffer
     * @param message - Message input
     * @param env - Process environment
     * @returns Promise<HandleResponse>
     */
    public async dryrun(buffer: ArrayBuffer | null, message: Message, env: Environment): Promise<HandleResponse> {
        return this.handle(buffer, message, env);
    }

    /**
     * Checks if a result is successful
     * @param result - The process result to check
     * @returns boolean
     */
    public static isSuccessResult(result: HandleResponse): boolean {
        return !('Error' in result);
    }
}
