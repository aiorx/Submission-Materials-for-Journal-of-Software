// Aided with basic GitHub coding tools
/**
 * Represents a single position record for an account as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-positions
 */
export interface IPosition {
    /** Position symbol. */
    symbol: string;
    /** Internal symbol identifier. */
    symbolId: number;
    /** Position quantity remaining open. */
    openQuantity: number;
    /** Portion of the position that was closed today. */
    closedQuantity?: number;
    /** Market value of the position (quantity x price). */
    currentMarketValue: number;
    /** Current price of the position symbol. */
    currentPrice: number;
    /** Average price paid for all executions constituting the position. */
    averageEntryPrice: number;
    /** Realized profit/loss on this position. */
    closedPnl: number;
    /** Unrealized profit/loss on this position. */
    openPnl: number;
    /** Total cost of the position. */
    totalCost: number;
    /** Designates whether real-time quote was used to compute PnL. */
    isRealTime: boolean;
    /** Designates whether a symbol is currently undergoing a reorg. */
    isUnderReorg: boolean;
}

/**
 * Response object for GET accounts/:id/positions containing an array of position records.
 */
export interface IGetAccountPositionsResponse {
    /** Array of position records. */
    positions: IPosition[];
}
