import { Tags } from '../../core/ao/abstract/types';
import { DEFAULT_TAGS } from '../../core/ao/constants';

/**
 * Merges provided tags with default tags
 * Default tags will be overridden by provided tags if they have the same name
 */
export const mergeWithDefaultTags = (tags: Tags = []): Tags => {
    const defaultTagMap = new Map(DEFAULT_TAGS.map(tag => [tag.name, tag.value]));
    const providedTagMap = new Map(tags.map(tag => [tag.name, tag.value]));

    // Merge maps, with provided tags taking precedence
    const mergedMap = new Map([...defaultTagMap, ...providedTagMap]);

    // Convert back to array of tag objects
    return Array.from(mergedMap.entries()).map(([name, value]) => ({ name, value }));
};
