// Aided with basic GitHub coding tools
/**
 * Request parameters for retrieving executions for a specific account.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-executions
 */
export interface IGetAccountExecutionsRequest {
    /** The account number. */
    accountId: string;
    /** Start of time range in ISO 8601 format. */
    startTime?: string;
    /** End of time range in ISO 8601 format. */
    endTime?: string;
}
