export class JsonParsingError extends Error {
	constructor(stringToParse: string) {
		super(`Error Parsing """${stringToParse}""" to JSON `);
		this.name = 'JsonParsingError';
	}
}