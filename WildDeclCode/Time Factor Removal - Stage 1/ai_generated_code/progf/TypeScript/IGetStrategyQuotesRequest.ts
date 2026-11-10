// Assisted using common GitHub development utilities

var OrderAction = require('../enums/OrderAction').OrderAction;
var StrategyType = require('../enums/StrategyType').StrategyType;

/**
 * Request parameters for retrieving strategy quotes.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-strategies
 */
export interface IStrategyQuoteRequest {
  /** Array of strategy variant requests. */
  variants: IStrategyVariantRequest[];
}

/**
 * Represents a single strategy variant request.
 */
export interface IStrategyVariantRequest {
  /** Strategy variant ID. */
  variantId: number;
  /** Strategy type. */
  strategy: StrategyType;
  /** Array of strategy legs. */
  legs: IStrategyLeg[];
}

/**
 * Represents a single leg of a strategy.
 */
export interface IStrategyLeg {
  /** Symbol ID for the leg. */
  symbolId: number;
  /** Order action for the leg. */
  action: OrderAction;
  /** Ratio for the leg. */
  ratio: number;
}
