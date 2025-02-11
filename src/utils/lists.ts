/**
 * Merges two lists of objects based on a key function
 * First list items will be overridden by second list items with the same key
 * @param list1 First list of objects
 * @param list2 Second list of objects (takes precedence over list1)
 * @param getKey Function to extract the key from an object
 * @returns Merged list with duplicates removed based on key
 */
export const mergeLists = <T>(list1: T[] = [], list2: T[] = [], getKey: (item: T) => string): T[] => {
    const map = new Map<string, T>();

    // Add items from first list
    list1.forEach(item => map.set(getKey(item), item));

    // Add/override items from second list
    list2.forEach(item => map.set(getKey(item), item));

    // Convert back to array
    return Array.from(map.values());
};
