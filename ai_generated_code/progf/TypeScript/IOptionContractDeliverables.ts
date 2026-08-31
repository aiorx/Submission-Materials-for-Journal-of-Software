// Assisted using common GitHub development utilities
import { IUnderlyingMultiplierPair } from './IUnderlyingMultiplierPair';

/**
 * Represents option contract deliverables for a symbol.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
 */
export interface IOptionContractDeliverables {
    /** List of underlying multiplier pairs for the deliverable. */
    underlyings: IUnderlyingMultiplierPair[];
    /** Amount of cash in lieu deliverable per contract. */
    cashInLieu: number;
}
