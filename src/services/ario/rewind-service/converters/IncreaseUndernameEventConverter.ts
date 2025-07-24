import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IIncreaseUndernameEvent } from "../arns-event/abstract/IIncreaseUndernameEvent";
import { IncreaseUndernameEvent } from "../arns-event/IncreaseUndernameEvent";

/**
 * Converter implementation for transforming Arweave transactions to IncreaseUndernameEvent objects
 */
export default class IncreaseUndernameEventConverter {

	/**
	 * Convert an Arweave transaction to a IncreaseUndernameEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted IncreaseUndernameEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IIncreaseUndernameEvent {
		return new IncreaseUndernameEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IIncreaseUndernameEvent[] {
		return transactions.map((transaction) => IncreaseUndernameEventConverter.convert(transaction))
	}

}
