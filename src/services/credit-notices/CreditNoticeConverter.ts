import { ArweaveTransaction } from "src/core/arweave/abstract/types";
import { CreditNotice } from "src/services/credit-notices/abstract/types";
import { TagUtils } from "src/core/common";

/**
 * Converter implementation for transforming Arweave transactions to CreditNotice objects
 */
export default class CreditNoticeConverter {
    private static readonly TAG_NAMES = {
        QUANTITY: 'Quantity',
        SENDER: 'Sender',
        FROM_PROCESS: 'From-Process'
    };

    /**
     * Convert an Arweave transaction to a CreditNotice
     * @param source The Arweave transaction to convert
     * @returns The converted CreditNotice object
     * @throws Error if required fields are missing
     */
    public static convert(source: ArweaveTransaction): CreditNotice {
        if (!source?.id || !source?.recipient || !source?.ingested_at) {
            throw new Error('Invalid credit notice transaction: Missing required base fields');
        }

        const tags = source.tags || [];
        const quantity = TagUtils.getTagValue(tags, CreditNoticeConverter.TAG_NAMES.QUANTITY);
        const sender = TagUtils.getTagValue(tags, CreditNoticeConverter.TAG_NAMES.SENDER);
        const fromProcess = TagUtils.getTagValue(tags, CreditNoticeConverter.TAG_NAMES.FROM_PROCESS);

        if (!quantity || !sender || !fromProcess) {
            throw new Error('Invalid credit notice transaction: Missing required tag fields');
        }

        return {
            id: source.id,
            recipient: source.recipient,
            quantity,
            sender,
            fromProcess,
            blockTimeStamp: source.block?.timestamp
        };
    }

}
