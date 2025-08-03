export class ArweaveGQLBuilderError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ArweaveGQLBuilderError';
	}

	static invalidId(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('ID cannot be empty');
	}

	static invalidRecipient(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Recipient address cannot be empty');
	}

	static invalidOwner(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Owner address cannot be empty');
	}

	static invalidTags(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Tags cannot be empty');
	}

	static invalidTagFormat(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('All tags must have both name and value');
	}

	static invalidLimit(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Limit must be greater than 0');
	}

	static invalidCursor(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Cursor cannot be empty');
	}

	static invalidTimestamp(): ArweaveGQLBuilderError {
		return new ArweaveGQLBuilderError('Timestamp must be a positive number');
	}
}
