// Supported via standard GitHub programming aids
/**
 * Represents a single OHLC (Open, High, Low, Close) candlestick record for a symbol.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-candles-id
 */
export interface ICandle {
    /** Candlestick start timestamp (ISO 8601 format). */
    start: string;
    /** Candlestick end timestamp (ISO 8601 format). */
    end: string;
    /** Opening price. */
    open: number;
    /** High price. */
    high: number;
    /** Low price. */
    low: number;
    /** Closing price. */
    close: number;
    /** Trading volume. */
    volume: number;
}

/**
 * Response object for GET markets/candles/:id containing an array of candlestick records.
 */
export interface IMarketCandlesResponse {
    /** Array of candlestick records. */
    candles: ICandle[];
}
