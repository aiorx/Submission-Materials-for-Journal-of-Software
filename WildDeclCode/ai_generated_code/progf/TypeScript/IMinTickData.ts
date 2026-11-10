// Supported via standard GitHub programming aids
/**
 * Represents the minimum price increment for a given price interval.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
 */
export interface IMinTickData {
    /** Beginning of the interval for a given minimum price increment. */
    pivot: number;
    /** Minimum price increment. */
    minTick: number;
}
