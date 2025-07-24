import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IBuyNameEvent } from "../arns-event/abstract/IBuyNameEvent";
import { BuyNameEvent } from "../arns-event/BuyNameEvent";

/**
 * Converter implementation for transforming Arweave transactions to BuyNameEvent objects
 */
export default class BuyNameEventConverter {

	/**
	 * Convert an Arweave transaction to a BuyNameEvent
	 * @param source The Arweave transaction to convert
	 * @returns The converted BuyNameEvent object
	 * @throws Error if required fields are missing
	 */
	public static convert(source: ArweaveTransaction): IBuyNameEvent {
		return new BuyNameEvent(source);
	}

	public static convertMany(transactions: ArweaveTransaction[]): IBuyNameEvent[] {
		return transactions.map((transaction) => BuyNameEventConverter.convert(transaction))
	}

}
