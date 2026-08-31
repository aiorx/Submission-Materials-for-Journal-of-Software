// Assisted using common GitHub development utilities
/**
 * Request parameters for retrieving account activities, including cash transactions, dividends, trades, etc.
 *
 * @remarks
 * Maximum 31 days of data can be requested at a time.
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-activities
 */
export interface IGetAccountActivitiesRequest {
    /** The account number. */
    accountId: string;
    /** The start time of the interval to retrieve activities (ISO 8601 format). */
    startTime?: string;
    /** The end time of the interval to retrieve activities (ISO 8601 format). */
    endTime?: string;
}
