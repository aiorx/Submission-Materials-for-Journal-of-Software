// Supported via standard GitHub programming aids
/**
 * Represents a single account activity record as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-activities
 */
export interface IAccountActivity {
    /** Trade date. */
    tradeDate: string;
    /** Transaction date. */
    transactionDate: string;
    /** Settlement date. */
    settlementDate: string;
    /** Activity action. */
    action: string;
    /** Symbol name. */
    symbol: string;
    /** Symbol ID. */
    symbolId: number;
    /** Description. */
    description: string;
    /** Currency. */
    currency: string;
    /** The quantity. */
    quantity: number;
    /** The price. */
    price: number;
    /** Gross amount. */
    grossAmount: number;
    /** The commission. */
    commission: number;
    /** Net amount. */
    netAmount: number;
    /** Activity type. */
    type: string;
}

/**
 * Response object for GET accounts/:id/activities containing an array of account activity records.
 */
export interface IGetAccountActivitiesResponse {
    /** Array of account activity records. */
    activities: IAccountActivity[];
}
