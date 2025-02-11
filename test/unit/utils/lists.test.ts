import { mergeLists } from 'src/utils/lists';

describe('mergeLists', () => {
    interface TestItem {
        id: string;
        value: string;
    }

    const getKey = (item: TestItem) => item.id;

    it('should merge two lists with no duplicates', () => {
        const list1: TestItem[] = [
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ];
        const list2: TestItem[] = [
            { id: '3', value: 'three' },
            { id: '4', value: 'four' }
        ];

        const result = mergeLists(list1, list2, getKey);

        expect(result).toEqual([
            { id: '1', value: 'one' },
            { id: '2', value: 'two' },
            { id: '3', value: 'three' },
            { id: '4', value: 'four' }
        ]);
    });

    it('should override items from first list with items from second list with same key', () => {
        const list1: TestItem[] = [
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ];
        const list2: TestItem[] = [
            { id: '2', value: 'two-updated' },
            { id: '3', value: 'three' }
        ];

        const result = mergeLists(list1, list2, getKey);

        expect(result).toEqual([
            { id: '1', value: 'one' },
            { id: '2', value: 'two-updated' },
            { id: '3', value: 'three' }
        ]);
    });

    it('should handle empty first list', () => {
        const list1: TestItem[] = [];
        const list2: TestItem[] = [
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ];

        const result = mergeLists(list1, list2, getKey);

        expect(result).toEqual([
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ]);
    });

    it('should handle empty second list', () => {
        const list1: TestItem[] = [
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ];
        const list2: TestItem[] = [];

        const result = mergeLists(list1, list2, getKey);

        expect(result).toEqual([
            { id: '1', value: 'one' },
            { id: '2', value: 'two' }
        ]);
    });

    it('should handle both empty lists', () => {
        const result = mergeLists([], [], getKey);
        expect(result).toEqual([]);
    });

    it('should handle undefined lists', () => {
        const result = mergeLists(undefined, undefined, getKey);
        expect(result).toEqual([]);
    });

    it('should work with different key functions', () => {
        interface DifferentItem {
            name: string;
            data: number;
        }

        const list1: DifferentItem[] = [
            { name: 'a', data: 1 },
            { name: 'b', data: 2 }
        ];
        const list2: DifferentItem[] = [
            { name: 'b', data: 3 },
            { name: 'c', data: 4 }
        ];

        const result = mergeLists(list1, list2, (item: DifferentItem) => item.name);

        expect(result).toEqual([
            { name: 'a', data: 1 },
            { name: 'b', data: 3 },
            { name: 'c', data: 4 }
        ]);
    });
});
