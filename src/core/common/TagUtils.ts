import { Tags } from "src/core/common/types";

/**
 * Utility class for working with ao process message tags.
 */
export default class TagUtils {
    /**
     * Gets the value of a tag with the specified name from a collection of tags.
     * @param tags The collection of tags to search
     * @param name The name of the tag to find
     * @returns The value of the tag if found, undefined otherwise
     */
    public static getTagValue(tags: Tags, name: string): string | undefined {
        const tag = tags.find(tag => tag.name === name);
        return tag?.value;
    }
}
