import {
    ArweaveGQLFilter,
    ArweaveGQLOptions,
    ArweaveGQLQuery,
    NodeFields,
    OwnerFields,
    AmountFields,
    DataFields,
    TagFields,
    BlockFields,
    ParentFields,
    ArweaveGQLSortOrder
} from './types';
import { ArweaveGQLBuilderError } from './ArweaveGQLBuilderError';

export class ArweaveGQLBuilder {
    private filters: ArweaveGQLFilter = {};
    private options: ArweaveGQLOptions = {};
    private fields: NodeFields = {
        id: true // Always include id by default
    };

    // Filter methods
    public ids(ids: string[]): this {
        if (!ids || ids.length === 0) throw ArweaveGQLBuilderError.invalidId();
        this.filters.ids = ids;
        return this;
    }

    public id(id: string): this {
        return this.ids([id]);
    }

    public recipient(address: string): this {
        if (!address) throw ArweaveGQLBuilderError.invalidRecipient();
        this.filters.recipient = address;
        return this;
    }

    public owner(address: string): this {
        if (!address) throw ArweaveGQLBuilderError.invalidOwner();
        this.filters.owner = { address };
        return this;
    }

    public tags(tags: { name: string; value: string }[]): this {
        if (!tags || !tags.length) throw ArweaveGQLBuilderError.invalidTags();
        if (!tags.every(tag => tag.name && tag.value)) {
            throw ArweaveGQLBuilderError.invalidTagFormat();
        }
        // Combine all tags into a single array for proper filtering
        this.filters.tags = tags;
        return this;
    }

    // Field selection methods
    public withAnchor(): this {
        this.fields.anchor = true;
        return this;
    }

    public withSignature(): this {
        this.fields.signature = true;
        return this;
    }

    public withOwner(fields: Partial<OwnerFields> = { address: true, key: true }): this {
        this.fields.owner = fields as OwnerFields;
        return this;
    }

    public withFee(fields: Partial<AmountFields> = { winston: true, ar: true }): this {
        this.fields.fee = fields as AmountFields;
        return this;
    }

    public withQuantity(fields: Partial<AmountFields> = { winston: true, ar: true }): this {
        this.fields.quantity = fields as AmountFields;
        return this;
    }

    public withData(fields: Partial<DataFields> = { size: true, type: true }): this {
        this.fields.data = fields as DataFields;
        return this;
    }

    public withTags(fields: Partial<TagFields> = { name: true, value: true }): this {
        this.fields.tags = fields as TagFields;
        return this;
    }

    public withBlock(fields: Partial<BlockFields> = { id: true, timestamp: true, height: true, previous: true }): this {
        this.fields.block = fields as BlockFields;
        return this;
    }

    public withParent(fields: Partial<ParentFields> = { id: true }): this {
        this.fields.parent = fields as ParentFields;
        return this;
    }

    /**
     * Includes all available fields in the query
     * @returns this builder instance
     */
    public withAllFields(): this {
        return this
            .withAnchor()
            .withSignature()
            .withOwner()
            .withFee()
            .withQuantity()
            .withData()
            .withTags()
            .withBlock()
            .withParent();
    }

    // Pagination and sorting options
    public limit(count: number): this {
        if (count < 1) throw ArweaveGQLBuilderError.invalidLimit();
        this.options.first = count;
        return this;
    }

    public after(cursor: string): this {
        if (!cursor) throw ArweaveGQLBuilderError.invalidCursor();
        this.options.after = cursor;
        return this;
    }

    public sortBy(sort: ArweaveGQLSortOrder): this {
        this.options.sort = sort;
        return this;
    }

    private isNestedField(value: any): value is Record<string, boolean> {
        return value && typeof value === 'object';
    }

    private buildFieldSelection(obj: Record<string, any>): string[] {
        const selections = new Set<string>();

        Object.entries(obj).forEach(([key, value]) => {
            if (value === true) {
                selections.add(key);
            } else if (this.isNestedField(value)) {
                const nestedFields = this.buildFieldSelection(value);
                if (nestedFields.length > 0) {
                    selections.add(`${key} { ${nestedFields.join(' ')} }`);
                }
            }
        });

        return Array.from(selections);
    }

    // Build the final query
    public build(): ArweaveGQLQuery {
        const filterConditions: string[] = [];

        // Build filter conditions
        Object.entries(this.filters).forEach(([key, value]) => {
            if (!value) return; // Skip null/undefined values

            if (typeof value === 'object') {
                if (key === 'tags') {
                    // Combine all tags into a single condition
                    const tags = value as { name: string; value: string }[];
                    const tagConditions = tags.map(tag =>
                        `{name: "${tag.name}", values: ["${tag.value}"]}`
                    );
                    if (tagConditions.length > 0) {
                        filterConditions.push(`tags: [${tagConditions.join(', ')}]`);
                    }
                } else if (key === 'owner' && value.address) {
                    filterConditions.push(`owners: ["${value.address}"]`);
                } else if (key === 'ids') {
                    filterConditions.push(`ids: ["${(value as string[]).join('", "')}"]`);
                }
            } else if (typeof value === 'string') {
                filterConditions.push(`${key}: "${value}"`);
            }
        });

        // Build options
        const optionsArray: string[] = [];
        if (this.options.first && this.options.first > 0) {
            optionsArray.push(`first: ${this.options.first}`);
        }
        if (this.options.after) {
            optionsArray.push(`after: "${this.options.after}"`);
        }
        if (this.options.sort) {
            optionsArray.push(`sort: ${this.options.sort}`);
        }

        // Build field selection
        const nodeFields = this.buildFieldSelection(this.fields);

        // Construct the final query
        const filterString = filterConditions.length > 0
            ? `(${filterConditions.join(', ')})`
            : '';

        const optionsString = optionsArray.length > 0
            ? `(${optionsArray.join(', ')})`
            : '';

        const query = `
            query {
                transactions${filterString}${optionsString} {
                    edges {
                        cursor
                        node {
                            ${nodeFields.join('\n                            ')}
                        }
                    }
                }
            }
        `.trim();

        return { query };
    }
}
