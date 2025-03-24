/**
 * Represents message tags sent to an ao process.
 * Tags are key-value pairs that provide metadata and instructions for message processing.
 * @see {@link https://cookbook_ao.g8way.io/concepts/messages.html | Message specification}
 */
export type Tags = Tag[];

/**
 * Represents a message tag sent to an ao process.
 * Tags are key-value pairs that provide metadata and instructions for message processing.
 * @see {@link https://cookbook_ao.g8way.io/concepts/messages.html | Message specification}
 */
export interface Tag {
    /** The name/key of the tag */
    name: string;
    /** The value associated with the tag */
    value: string;
}