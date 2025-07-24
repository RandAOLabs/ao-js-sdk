import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IUpgradeNameEvent } from "../arns-event/abstract/IUpgradeNameEvent";
import { UpgradeNameEvent } from "../arns-event/UpgradeNameEvent";

/**
 * Converter implementation for transforming Arweave transactions to UpgradeNameEvent objects
 */
export default class UpgradeNameEventConverter {

	/**
	 * Convert an Arweave transaction to a UpgradeNameEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted UpgradeNameEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IUpgradeNameEvent {
		return new UpgradeNameEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IUpgradeNameEvent[] {
		return transactions.map((transaction) => UpgradeNameEventConverter.convert(transaction))
	}

}
