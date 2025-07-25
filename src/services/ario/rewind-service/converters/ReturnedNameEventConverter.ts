import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IReturnedNameEvent } from "../events/ARNameEvent/abstract/IReturnedNameEvent";
import { ReturnedNameEvent } from "../events/ARNameEvent/ReturnedNameEvent";

/**
 * Converter implementation for transforming Arweave transactions to ReturnedNameEvent objects
 */
export default class ReturnedNameEventConverter {

	/**
	 * Convert an Arweave transaction to a ReturnedNameEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted ReturnedNameEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IReturnedNameEvent {
		return new ReturnedNameEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IReturnedNameEvent[] {
		return transactions.map((transaction) => ReturnedNameEventConverter.convert(transaction))
	}

}
