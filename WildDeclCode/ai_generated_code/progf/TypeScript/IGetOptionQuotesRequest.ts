// Supported via standard GitHub programming aids

import { OptionType } from "../enums/OptionType";

/**
 * Request parameters for retrieving option quotes.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-options
 */
export interface IOptionQuoteFilter {
  /** Option type filter. */
  optionType?: OptionType;
  /** Underlying symbol ID. */
  underlyingId: number;
  /** Expiry date (ISO 8601 format). */
  expiryDate: string;
  /** Minimum strike price filter. */
  minstrikePrice?: number;
  /** Maximum strike price filter. */
  maxstrikePrice?: number;
}

/**
 * Request object for GET markets/quotes/options.
 */
export interface IGetOptionQuotesRequest {
  /** Array of option quote filters. */
  filters?: IOptionQuoteFilter[];
  /** Array of option IDs to retrieve. */
  optionIds?: number[];
}
