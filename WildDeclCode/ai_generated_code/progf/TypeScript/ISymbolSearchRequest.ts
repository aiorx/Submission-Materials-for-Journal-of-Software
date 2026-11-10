// Assisted using common GitHub development utilities
/**
 * Request parameters for searching symbols by prefix.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-search
 */
export interface ISymbolSearchRequest {
    /** Symbol prefix to search for. */
    prefix: string;
    /** Offset for paginated results. */
    offset?: number;
}
