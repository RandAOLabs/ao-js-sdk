import { IFullARNSName } from "./abstract/IFullARNSName";

/**
 * Represents a full ARNS name that can be either:
 * - A top-level ARN (e.g., "name")
 * - An ARN with an undername (e.g., "undername_name")
 *
 * The underscore character (_) is used as a delimiter between the undername and the main ARN name.
 * @category ARIO
 */
export class FullARNSName implements IFullARNSName {
	constructor(
		private readonly fullName: string,
	) { }

	hasUndername(): boolean {
		return this.fullName.includes('_');
	}

	getUndername(): string | undefined {
		if (!this.hasUndername()) {
			return undefined;
		}
		const underscoreIndex = this.fullName.indexOf('_');
		return this.fullName.substring(0, underscoreIndex);
	}

	getARNSName(): string {
		if (!this.hasUndername()) {
			return this.fullName;
		}
		const underscoreIndex = this.fullName.indexOf('_');
		return this.fullName.substring(underscoreIndex + 1);
	}
}
