// Supported via standard GitHub programming aids
/**
 * Represents the allowed strategy types for multi-leg options strategies.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/enumerations/enumerations
 *
 * - 'CoveredCall'
 * - 'MarriedPuts'
 * - 'VerticalCallSpread'
 * - 'VerticalPutSpread'
 * - 'CalendarCallSpread'
 * - 'CalendarPutSpread'
 * - 'DiagonalCallSpread'
 * - 'DiagonalPutSpread'
 * - 'Collar'
 * - 'Straddle'
 * - 'Strangle'
 * - 'ButterflyCall'
 * - 'ButterflyPut'
 * - 'IronButterfly'
 * - 'CondorCall'
 * - 'Custom'
 */
export type StrategyType =
    | 'CoveredCall'
    | 'MarriedPuts'
    | 'VerticalCallSpread'
    | 'VerticalPutSpread'
    | 'CalendarCallSpread'
    | 'CalendarPutSpread'
    | 'DiagonalCallSpread'
    | 'DiagonalPutSpread'
    | 'Collar'
    | 'Straddle'
    | 'Strangle'
    | 'ButterflyCall'
    | 'ButterflyPut'
    | 'IronButterfly'
    | 'CondorCall'
    | 'Custom';
