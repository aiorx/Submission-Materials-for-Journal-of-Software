// Assisted using common GitHub development utilities
/**
 * Request parameters for retrieving orders for a specified account.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-orders
 */
export interface IGetAccountOrdersRequest {
    /** The account number. */
    accountId: string;
    /** Start of time range in ISO 8601 format. */
    startTime?: string;
    /** End of time range in ISO 8601 format. */
    endTime?: string;
    /** Retrieve all, active, or closed orders. */
    stateFilter?: 'All' | 'Open' | 'Closed';
    /** Retrieve single order details by order ID. */
    orderId?: number;
}
