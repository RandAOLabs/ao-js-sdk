import { Observable } from 'rxjs';
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import {
    GetAllMessagesParams,
    GetAllMessagesBySenderParams,
    GetAllMessagesByRecipientParams
} from "../../message-service/abstract/types";

/**
 * Reactive interface for message service operations that provides RxJS Observable streams
 */
export interface IReactiveMessageService {
    /**
     * Streams all messages matching the given filters as they are fetched
     * @param params Parameters for filtering messages
     * @returns Observable that emits arrays of messages as they are fetched
     */
    streamAllMessages(params: GetAllMessagesParams): Observable<ArweaveTransaction[]>;

    /**
     * Streams all messages sent by a specific address
     * @param params Parameters for filtering messages, including required sender ID
     * @returns Observable that emits arrays of messages as they are fetched
     */
    streamAllMessagesSentBy(params: GetAllMessagesBySenderParams): Observable<ArweaveTransaction[]>;

    /**
     * Gets the latest message matching the given filters
     * @param params Parameters for filtering messages
     * @returns Observable that emits a single message or undefined if none found
     */
    getLatestMessage(params: GetAllMessagesParams): Observable<ArweaveTransaction | undefined>;
}
