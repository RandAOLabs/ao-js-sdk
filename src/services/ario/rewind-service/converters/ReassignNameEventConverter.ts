import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IReassignNameEvent } from "../events/ARNameEvent/abstract/IReassignNameEvent";
import { ReassignNameEvent } from "../events/ARNameEvent/ReassignNameEvent";

/**
 * Converter implementation for transforming Arweave transactions to ReassignNameEvent objects
 */
export default class ReassignNameEventConverter {

	/**
	 * Convert an Arweave transaction to a ReassignNameEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted ReassignNameEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IReassignNameEvent {
		return new ReassignNameEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IReassignNameEvent[] {
		return transactions.map((transaction) => ReassignNameEventConverter.convert(transaction))
	}

}
