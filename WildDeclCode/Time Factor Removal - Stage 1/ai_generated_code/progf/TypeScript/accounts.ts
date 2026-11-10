// Assisted using common GitHub development utilities
var z = require('zod').z;

// --- Accounts ---
var ZAccount = z.object({
  type: z.string(),
  number: z.string(),
  status: z.string(),
  isPrimary: z.boolean(),
  isBilling: z.boolean(),
  clientAccountType: z.string(),
});
var ZGetAccountsResponse = z.object({
  accounts: z.array(ZAccount),
  userId: z.number(),
});

var ZBalance = z.object({
  currency: z.string(),
  cash: z.number(),
  marketValue: z.number(),
  totalEquity: z.number(),
  buyingPower: z.number(),
  maintenanceExcess: z.number(),
  isRealTime: z.boolean(),
});
var ZGetAccountBalancesResponse = z.object({
  perCurrencyBalances: z.array(ZBalance),
  combinedBalances: z.array(ZBalance),
  sodPerCurrencyBalances: z.array(ZBalance),
  sodCombinedBalances: z.array(ZBalance),
});

var ZPosition = z.object({
  symbol: z.string(),
  symbolId: z.number(),
  openQuantity: z.number(),
  closedQuantity: z.number().optional(),
  currentMarketValue: z.number(),
  currentPrice: z.number(),
  averageEntryPrice: z.number(),
  closedPnl: z.number(),
  openPnl: z.number(),
  totalCost: z.number(),
  isRealTime: z.boolean(),
  isUnderReorg: z.boolean(),
});
var ZGetAccountPositionsResponse = z.object({
  positions: z.array(ZPosition),
});

// TypeScript inference for type safety
export type Account = z.infer<typeof ZAccount>;
export type GetAccountsResponse = z.infer<typeof ZGetAccountsResponse>;
export type Balance = z.infer<typeof ZBalance>;
export type GetAccountBalancesResponse = z.infer<typeof ZGetAccountBalancesResponse>;
export type Position = z.infer<typeof ZPosition>;
export type GetAccountPositionsResponse = z.infer<typeof ZGetAccountPositionsResponse>;
