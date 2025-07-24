import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IRecordEvent } from "../arns-event/abstract/IRecordEvent";
import { RecordEvent } from "../arns-event/RecordEvent";

/**
 * Converter implementation for transforming Arweave transactions to RecordEvent objects
 */
export default class RecordEventConverter {

	/**
	 * Convert an Arweave transaction to a RecordEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted RecordEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IRecordEvent {
		return new RecordEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IRecordEvent[] {
		return transactions.map((transaction) => RecordEventConverter.convert(transaction))
	}

}
