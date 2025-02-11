import { ArweaveGQLBuilder, ArweaveGQLSortOrder } from '../../../../src/core/arweave/gql';

describe('ArweaveGQLBuilder', () => {
    let builder: ArweaveGQLBuilder;

    beforeEach(() => {
        builder = new ArweaveGQLBuilder();
    });

    it('should build a basic query with default fields', () => {
        const result = builder.build();
        expect(result.query).toContain('id');
        expect(result.query).toContain('edges');
        expect(result.query).toContain('cursor');
        expect(result.query).toContain('node');
    });

    describe('Filter Methods', () => {
        it('should add id filter', () => {
            const result = builder.id('test-id').build();
            expect(result.query).toContain('ids: ["test-id"]');
        });

        it('should add single recipient filter', () => {
            const result = builder.recipient('test-address').build();
            expect(result.query).toContain('recipients: ["test-address"]');
        });

        it('should add multiple recipients filter', () => {
            const result = builder.recipients(['address1', 'address2']).build();
            expect(result.query).toContain('recipients: ["address1", "address2"]');
        });

        it('should add owner filter', () => {
            const result = builder.owner('test-owner').build();
            expect(result.query).toContain('owners: ["test-owner"]');
        });

        it('should add tags filter', () => {
            const result = builder
                .tags([{ name: 'Test-Tag', value: 'test-value' }])
                .build();
            expect(result.query).toContain('tags: [{name: "Test-Tag", values: ["test-value"]}]');
        });
    });

    describe('Field Selection Methods', () => {
        it('should add anchor field', () => {
            const result = builder.withAnchor().build();
            expect(result.query).toContain('anchor');
        });

        it('should add signature field', () => {
            const result = builder.withSignature().build();
            expect(result.query).toContain('signature');
        });

        it('should add owner fields', () => {
            const result = builder.withOwner({ address: true }).build();
            expect(result.query).toContain('owner { address }');
        });

        it('should add fee fields', () => {
            const result = builder.withFee({ winston: true }).build();
            expect(result.query).toContain('fee { winston }');
        });

        it('should add quantity fields', () => {
            const result = builder.withQuantity({ ar: true }).build();
            expect(result.query).toContain('quantity { ar }');
        });

        it('should add data fields', () => {
            const result = builder.withData({ size: true }).build();
            expect(result.query).toContain('data { size }');
        });

        it('should add tags fields', () => {
            const result = builder.withTags({ name: true, value: true }).build();
            expect(result.query).toContain('tags { name value }');
        });

        it('should add block fields', () => {
            const result = builder.withBlock({ height: true }).build();
            expect(result.query).toContain('block { height }');
        });

        it('should add parent fields', () => {
            const result = builder.withParent({ id: true }).build();
            expect(result.query).toContain('parent { id }');
        });
    });

    describe('Pagination and Sorting', () => {
        it('should add limit', () => {
            const result = builder.limit(10).build();
            expect(result.query).toContain('first: 10');
        });

        it('should add cursor', () => {
            const result = builder.after('test-cursor').build();
            expect(result.query).toContain('after: "test-cursor"');
        });

        it('should add sort order', () => {
            const result = builder.sortBy(ArweaveGQLSortOrder.HEIGHT_DESC).build();
            expect(result.query).toContain('sort: HEIGHT_DESC');
        });
    });

    describe('Error Handling', () => {
        it('should throw error for empty id', () => {
            expect(() => builder.id('')).toThrow('ID cannot be empty');
        });

        it('should throw error for empty recipient', () => {
            expect(() => builder.recipient('')).toThrow('Recipient address cannot be empty');
        });

        it('should throw error for empty owner', () => {
            expect(() => builder.owner('')).toThrow('Owner address cannot be empty');
        });

        it('should throw error for empty tags array', () => {
            expect(() => builder.tags([])).toThrow('Tags cannot be empty');
        });

        it('should throw error for invalid tag format', () => {
            expect(() => builder.tags([{ name: '', value: 'test' }])).toThrow('All tags must have both name and value');
        });

        it('should throw error for invalid limit', () => {
            expect(() => builder.limit(0)).toThrow('Limit must be greater than 0');
        });

        it('should throw error for empty cursor', () => {
            expect(() => builder.after('')).toThrow('Cursor cannot be empty');
        });
    });

    describe('Complex Queries', () => {
        it('should combine multiple filters and fields', () => {
            const result = builder
                .recipients(['test-address'])
                .withOwner({ address: true })
                .withBlock({ height: true })
                .limit(5)
                .sortBy(ArweaveGQLSortOrder.HEIGHT_ASC)
                .build();

            const query = result.query;
            expect(query).toMatch(/recipients: \["test-address"\]/);
            expect(query).toMatch(/owner \{ address \}/);
            expect(query).toMatch(/block \{ height \}/);
            expect(query).toMatch(/first: 5/);
            expect(query).toMatch(/sort: HEIGHT_ASC/);
        });
    });
});
