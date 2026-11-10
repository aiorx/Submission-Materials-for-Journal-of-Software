// Assisted using common GitHub development utilities
import { IMinTickData } from './IMinTickData';
import { IOptionContractDeliverables } from './IOptionContractDeliverables';

/**
 * Represents detailed information about a symbol as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
 */
export interface ISymbolInfo {
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
  /** List of minimum tick data for price increments. */
  minTicks: IMinTickData[];
  /** Option contract deliverables, if applicable. */
  optionContractDeliverables?: IOptionContractDeliverables;
  /** Additional properties as returned by the API. */
  [key: string]: any;
}

/**
 * Response object for GET symbols/:id containing an array of symbol info objects.
 */
export interface IGetSymbolByIdResponse {
  /** Array of symbol information objects. */
  symbols: ISymbolInfo[];
}
