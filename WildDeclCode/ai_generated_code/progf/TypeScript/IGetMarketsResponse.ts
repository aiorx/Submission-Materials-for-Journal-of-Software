// Aided with basic GitHub coding tools
/**
 * Represents a single market as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets
 */
export interface IMarket {
    /** Market name. */
    name: string;
    /** List of trading venues for the market. */
    tradingVenues: string[];
    /** Default trading venue. */
    defaultTradingVenue: string;
    /** List of primary order routes. */
    primaryOrderRoutes: string[];
    /** List of secondary order routes. */
    secondaryOrderRoutes: string[];
    /** List of level 1 feeds. */
    level1Feeds: string[];
    /** List of level 2 feeds. */
    level2Feeds: string[];
    /** Extended market start time (ISO 8601 format). */
    extendedStartTime: string;
    /** Market start time (ISO 8601 format). */
    startTime: string;
    /** Market end time (ISO 8601 format). */
    endTime: string;
    /** Extended market end time (ISO 8601 format). */
    extendedEndTime: string;
    /** Market currency. */
    currency: string;
    /** Snap quotes limit. */
    snapQuotesLimit: number;
}

/**
 * Response object for GET markets containing an array of market records.
 */
export interface IGetMarketsResponse {
    /** Array of market records. */
    markets: IMarket[];
}
