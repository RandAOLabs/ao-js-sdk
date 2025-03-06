/**
 * A generic builder interface that can be used to construct objects of type T
 * @template T The type of object being built
 */
export interface IBuilder<T> {
    /**
     * Builds and returns the final object
     * @returns The constructed object of type T
     */
    build(): T | Promise<T>;

    /**
     * Resets the builder to its initial state
     * @returns The builder instance for method chaining
     */
    reset(): this;

    /**
     * Controls whether default values should be allowed during building
     * @param allow If true, allows default values to be used for unset properties
     * @returns The builder instance for method chaining
     */
    allowDefaults(allow: boolean): this;
}