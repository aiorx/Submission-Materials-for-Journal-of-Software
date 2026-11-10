// Supported via standard GitHub programming aids
/**
 * Represents a single balance record for an account as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-balances
 */
export interface IBalance {
    /** Currency of the balance figure (e.g., "USD" or "CAD"). */
    currency: string;
    /** Balance amount. */
    cash: number;
    /** Market value of all securities in the account in a given currency. */
    marketValue: number;
    /** Equity as a difference between cash and marketValue properties. */
    totalEquity: number;
    /** Buying power for that particular currency side of the account. */
    buyingPower: number;
    /** Maintenance excess for that particular side of the account. */
    maintenanceExcess: number;
    /** Whether real-time data was used to calculate the above values. */
    isRealTime: boolean;
}

/**
 * Response object for GET accounts/:id/balances containing per-currency and combined balances.
 */
export interface IGetAccountBalancesResponse {
    /** List of account records per currency. */
    perCurrencyBalances: IBalance[];
    /** List of combined balance records. */
    combinedBalances: IBalance[];
    /** List of start-of-day account records per currency. */
    sodPerCurrencyBalances: IBalance[];
    /** List of start-of-day combined balance records. */
    sodCombinedBalances: IBalance[];
}
