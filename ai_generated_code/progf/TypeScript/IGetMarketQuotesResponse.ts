// Supported via standard GitHub programming aids
/**
 * Represents a single quote for a market symbol as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-id
 */
export interface IQuote {
    /** Symbol that follows Questrade symbology (e.g., "TD.TO"). */
    symbol: string;
    /** Internal symbol identifier. */
    symbolId: number;
    /** Tier of the quote, if applicable. */
    tier?: string;
    /** Bid price. */
    bidPrice: number;
    /** Bid size. */
    bidSize: number;
    /** Ask price. */
    askPrice: number;
    /** Ask size. */
    askSize: number;
    /** Last trade price during trading hours, if available. */
    lastTradePriceTrHrs?: number;
    /** Last trade price. */
    lastTradePrice: number;
    /** Last trade size. */
    lastTradeSize: number;
    /** Last trade tick direction. */
    lastTradeTick: string;
    /** Last trade time (ISO 8601 format), if available. */
    lastTradeTime?: string;
    /** Trading volume. */
    volume: number;
    /** Opening price. */
    openPrice: number;
    /** High price. */
    highPrice: number;
    /** Low price. */
    lowPrice: number;
    /** Whether the quote is delayed. */
    delay: boolean;
    /** Whether the symbol is currently halted. */
    isHalted: boolean;
}

/**
 * Response object for GET markets/quotes/:id containing an array of quote records.
 */
export interface IGetMarketQuotesResponse {
    /** Array of quote records. */
    quotes: IQuote[];
}
