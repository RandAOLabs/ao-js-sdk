import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IExtendLeaseEvent } from "../arns-event/abstract/IExtendLeaseEvent";
import { ExtendLeaseEvent } from "../arns-event/ExtendLeaseEvent";

/**
 * Converter implementation for transforming Arweave transactions to ExtendLeaseEvent objects
 */
export default class ExtendLeaseEventConverter {

	/**
	 * Convert an Arweave transaction to a ExtendLeaseEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted ExtendLeaseEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IExtendLeaseEvent {
		return new ExtendLeaseEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IExtendLeaseEvent[] {
		return transactions.map((transaction) => ExtendLeaseEventConverter.convert(transaction))
	}

}
