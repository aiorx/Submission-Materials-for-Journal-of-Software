// Supported via standard GitHub programming aids
/**
 * Represents an equity symbol as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
 */
export interface IEquitySymbol {
    /** Symbol that follows Questrade symbology (e.g., "TD.TO"). */
    symbol: string;
    /** Internal symbol identifier. */
    symbolId: number;
    /** Symbol description (e.g., "Microsoft Corp."). */
    description: string;
    /** Security type (e.g., "Stock"). */
    securityType: string;
    /** Primary listing exchange (e.g., "NASDAQ"). */
    listingExchange: string;
    /** Indicates whether the symbol is actively listed. */
    isQuotable: boolean;
    /** Indicates whether the symbol is tradable. */
    isTradable: boolean;
    /** Currency code (ISO format). */
    currency: string;
}

/**
 * Response object for symbol search containing an array of equity symbols.
 */
export interface ISymbolSearchResponse {
    /** Array of equity symbol objects. */
    symbols: IEquitySymbol[];
}
