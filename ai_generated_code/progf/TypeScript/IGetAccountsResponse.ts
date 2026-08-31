// Assisted using common GitHub development utilities
/**
 * Represents a single account as returned by the Questrade API.
 *
 * @remarks
 * See: https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts
 */
export interface IAccount {
  /** Type of the account (e.g., "Cash", "Margin"). */
  type: string;
  /** Eight-digit account number (e.g., "26598145"). */
  number: string;
  /** Status of the account (e.g., Active). */
  status: string;
  /** Whether this is a primary account for the holder. */
  isPrimary: boolean;
  /** Whether this account is one that gets billed for various expenses such as fees, market data, etc. */
  isBilling: boolean;
  /** Type of client holding the account (e.g., "Individual"). */
  clientAccountType: string;
}

/**
 * Response object for GET accounts containing an array of account records and user ID.
 */
export interface IGetAccountsResponse {
  /** Array of account records. */
  accounts: IAccount[];
  /** Internal identifier of the user making the request. */
  userId: number;
}
