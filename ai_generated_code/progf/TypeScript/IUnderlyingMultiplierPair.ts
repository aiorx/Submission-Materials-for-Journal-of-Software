// Supported via standard GitHub programming aids
/**
 * Represents a pair of underlying symbol and multiplier for option contract deliverables.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
 */
export interface IUnderlyingMultiplierPair {
    /** Number of shares deliverable per contract (e.g., 100). */
    multiplier: number;
    /** Underlying symbol for the deliverable (e.g., "MSFT"). */
    underlyingSymbol: string;
    /** Underlying symbol id for the deliverable (e.g., 2345343). */
    underlyingSymbolId: number;
}
