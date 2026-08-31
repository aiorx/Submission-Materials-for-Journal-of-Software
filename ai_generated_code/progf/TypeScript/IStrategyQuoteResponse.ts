// Aided with basic GitHub coding tools
/**
 * Represents a single strategy quote as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-strategies
 */
export interface IStrategyQuote {
    /** Strategy variant ID. */
    variantId: number;
    /** Bid price. */
    bidPrice: number;
    /** Ask price. */
    askPrice: number;
    /** Underlying symbol. */
    underlying: string;
    /** Underlying symbol ID. */
    underlyingId: number;
    /** Opening price, or null if not available. */
    openPrice: number | null;
    /** Implied volatility. */
    volatility: number;
    /** Option delta. */
    delta: number;
    /** Option gamma. */
    gamma: number;
    /** Option theta. */
    theta: number;
    /** Option vega. */
    vega: number;
    /** Option rho. */
    rho: number;
    /** Whether the quote is real-time. */
    isRealTime: boolean;
}

/**
 * Response object for GET markets/quotes/strategies containing an array of strategy quote records.
 */
export interface IStrategyQuoteResponse {
    /** Array of strategy quote records. */
    strategyQuotes: IStrategyQuote[];
}
