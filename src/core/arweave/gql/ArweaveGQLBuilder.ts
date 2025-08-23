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
import { ArweaveNodeType } from '../graphql-nodes';

/**
 * @category Core
 */
export class ArweaveGQLBuilder {
	private filters: ArweaveGQLFilter = {};
	private options: ArweaveGQLOptions = {};
	private fields: NodeFields = {
		id: true // Always include id by default
	};
	private countMode: boolean = false;
	private tagNamesFilter: string[] = [];

	// Filter methods
	public ids(ids: string[]): this {
		if (!ids || ids.length === 0) throw ArweaveGQLBuilderError.invalidId();
		this.filters.ids = ids;
		return this;
	}

	public id(id: string): this {
		if (!id) throw ArweaveGQLBuilderError.invalidId();
		return this.ids([id]);
	}

	public recipients(addresses: string[]): this {
		if (!addresses || addresses.length === 0) throw ArweaveGQLBuilderError.invalidRecipient();
		this.filters.recipients = addresses;
		return this;
	}

	public recipient(address: string): this {
		if (!address) throw ArweaveGQLBuilderError.invalidRecipient();
		return this.recipients([address]);
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

	public containsTagName(tagName: string): this {
		if (!tagName) throw ArweaveGQLBuilderError.invalidTags();
		this.tagNamesFilter.push(tagName);
		return this;
	}

	public minIngestedAt(time: number): this {
		if (!time || time < 0) throw ArweaveGQLBuilderError.invalidTimestamp();
		this.filters.ingested_at = { min: time };
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

	public withRecipient(): this {
		this.fields.recipient = true;
		return this;
	}

	public withIngestedAt(): this {
		this.fields.ingested_at = true;
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
			.withRecipient()
			.withIngestedAt()
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

	/**
	 * Gets the current limit set on the builder
	 * @returns The current limit or undefined if not set
	 */
	public getLimit(): number | undefined {
		return this.options.first;
	}

	private isNestedField(value: any): value is Record<string, boolean> {
		return value && typeof value === 'object';
	}

	/**
	 * Switches the query to return a count of matching transactions instead of transaction data
	 * @returns this builder instance
	 */
	public count(): this {
		this.countMode = true;
		return this;
	}

	private buildFieldSelection(obj: Record<string, any>, optimizedNode: boolean): string[] {
		const selections = new Set<string>();

		Object.entries(obj).forEach(([key, value]) => {
			if (value === true) {
				if (key == 'ingested_at') {
					// Only Optimized nodes support ingested_at
					if (optimizedNode) {
						selections.add(key);
					}
				} else {
					selections.add(key);
				}
			} else if (this.isNestedField(value)) {
				const nestedFields = this.buildFieldSelection(value, optimizedNode);
				if (nestedFields.length > 0) {
					selections.add(`${key} { ${nestedFields.join(' ')} }`);
				}
			}
		});

		return Array.from(selections);
	}

	// Build the final query
	public build(nodeType: ArweaveNodeType): ArweaveGQLQuery {
		const optimizedNode = nodeType === ArweaveNodeType.GOLDSKY
		const filterConditions: string[] = [];

		// Build filter conditions
		Object.entries(this.filters).forEach(([key, value]) => {
			if (!value) return; // Skip null/undefined values

			if (key === 'tags') {
				// Handle exact tag name/value pairs
				const tags = value as { name: string; value: string }[];
				const tagConditions = tags.map(tag =>
					`{name: "${tag.name}", values: ["${tag.value}"]}`
				);

				// Add tag name only filters (containsTagName)
				const tagNameConditions = this.tagNamesFilter.map(tagName =>
					`{name: "${tagName}"}`
				);

				// Combine both types of tag conditions
				const allTagConditions = [...tagConditions, ...tagNameConditions];
				if (allTagConditions.length > 0) {
					filterConditions.push(`tags: [${allTagConditions.join(', ')}]`);
				}
			} else if (key === 'owner' && typeof value === 'object' && value.address) {
				// Handle owner
				filterConditions.push(`owners: ["${value.address}"]`);
			} else if (key === 'ingested_at' && typeof value === 'object' && value.min) {
				// Handle ingested_at filter
				if (optimizedNode) {
					// Optimized endcpoints support injected at
					filterConditions.push(`ingestedAt: { min: ${value.min} }`);
				}
			} else if (Array.isArray(value)) {
				// Handle arrays (ids, recipients)
				filterConditions.push(`${key}: ["${value.join('", "')}"]`);
			}
		});

		// Handle containsTagName filters when no exact tags are specified
		if (!this.filters.tags && this.tagNamesFilter.length > 0) {
			const tagNameConditions = this.tagNamesFilter.map(tagName =>
				`{name: "${tagName}"}`
			);
			filterConditions.push(`tags: [${tagNameConditions.join(', ')}]`);
		}

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
		const nodeFields = this.buildFieldSelection(this.fields, optimizedNode);

		// Construct the final query
		// Combine filter conditions and options
		const queryParams = [...filterConditions, ...optionsArray];
		const queryString = queryParams.length > 0
			? `(${queryParams.join(', ')})`
			: '';

		const query = `
            query {
                transactions${queryString} {
                    ${this.countMode ? 'count' : `edges {
                        cursor
                        node {
                            ${nodeFields.join('\n                            ')}
                        }
                    }`}
                }
            }
        `.trim();

		return { query };
	}
}
