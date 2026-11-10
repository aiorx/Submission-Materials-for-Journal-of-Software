// Aided with basic GitHub coding tools
/**
 * Represents a single order record as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-orders
 */
export interface IOrder {
    /** Internal order identifier. */
    id: number;
    /** Symbol that follows Questrade symbology (e.g., "TD.TO"). */
    symbol: string;
    /** Internal symbol identifier. */
    symbolId: number;
    /** Total quantity of the order. */
    totalQuantity: number;
    /** Unfilled portion of the order quantity. */
    openQuantity: number;
    /** Filled portion of the order quantity. */
    filledQuantity: number;
    /** Unfilled portion of the order quantity after cancellation. */
    canceledQuantity: number;
    /** Client view of the order side (e.g., "Buy-To-Open"). */
    side: string;
    /** Order price type (e.g., "Market"). */
    orderType: string;
    /** Limit price. */
    limitPrice?: number;
    /** Stop price. */
    stopPrice?: number;
    /** Specifies all-or-none special instruction. */
    isAllOrNone: boolean;
    /** Specifies Anonymous special instruction. */
    isAnonymous: boolean;
    /** Specifies Iceberg special instruction. */
    icebergQuantity?: number;
    /** Specifies Minimum special instruction. */
    minQuantity?: number;
    /** Average price of all executions received for this order. */
    avgExecPrice?: number;
    /** Price of the last execution received for the order in question. */
    lastExecPrice?: number;
    /** Source of the order. */
    source: string;
    /** See Order Time In Force section for all allowed values. */
    timeInForce: string;
    /** Good-Till-Date marker and date parameter. */
    gtdDate?: string;
    /** See Order State section for all allowed values. */
    state: string;
    /** Human readable order rejection reason message. */
    clientReasonStr?: string;
    /** Internal identifier of a chain to which the order belongs. */
    chainId: number;
    /** Order creation time. */
    creationTime: string;
    /** Time of the last update. */
    updateTime: string;
    /** Notes that may have been manually added by Questrade staff. */
    notes?: string;
    /** Primary route. */
    primaryRoute: string;
    /** Secondary route. */
    secondaryRoute?: string;
    /** Order route name. */
    orderRoute: string;
    /** Venue where non-marketable portion of the order was booked. */
    venueHoldingOrder?: string;
    /** Total commission amount charged for this order. */
    commissionCharged: number;
    /** Identifier assigned to this order by exchange where it was routed. */
    exchangeOrderId: string;
    /** Whether user that placed the order is a significant shareholder. */
    isSignificantShareholder: boolean;
    /** Whether user that placed the order is an insider. */
    isInsider: boolean;
    /** Whether limit offset is specified in dollars (vs. percent). */
    isLimitOffsetInDollar: boolean;
    /** Internal identifier of user that placed the order. */
    userId: number;
    /** Commission for placing the order via the Trade Desk over the phone. */
    placementCommission?: number;
    /** Multi-leg strategy to which the order belongs. */
    strategyType: string;
    /** Internal identifier of the main chain. */
    mainChainId?: number;
    /** List of order legs. */
    legs: any[];
}

/**
 * Response object for GET accounts/:id/orders containing an array of order records.
 */
export interface IGetAccountOrdersResponse {
    /** Array of order records. */
    orders: IOrder[];
}
