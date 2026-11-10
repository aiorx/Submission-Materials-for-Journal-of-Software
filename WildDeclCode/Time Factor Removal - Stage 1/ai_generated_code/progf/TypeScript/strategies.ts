// Assisted using common GitHub development utilities
var z = require('zod').z;

// --- Strategies ---
var ZStrategyLeg = z.object({
  symbolId: z.number(),
  action: z.enum(['Buy', 'Sell']),
  ratio: z.number(),
});
var ZStrategyVariantRequest = z.object({
  variantId: z.number(),
  strategy: z.enum([
    'CoveredCall',
    'MarriedPuts',
    'VerticalCallSpread',
    'VerticalPutSpread',
    'CalendarCallSpread',
    'CalendarPutSpread',
    'DiagonalCallSpread',
    'DiagonalPutSpread',
    'Collar',
    'Straddle',
    'Strangle',
    'ButterflyCall',
    'ButterflyPut',
    'IronButterfly',
    'CondorCall',
    'Custom',
  ]),
  legs: z.array(ZStrategyLeg),
});
var ZStrategyQuoteRequest = z.object({
  variants: z.array(ZStrategyVariantRequest),
});
var ZStrategyQuote = z.object({
  variantId: z.number(),
  bidPrice: z.number(),
  askPrice: z.number(),
  underlying: z.string(),
  underlyingId: z.number(),
  openPrice: z.number().nullable(),
  volatility: z.number(),
  delta: z.number(),
  gamma: z.number(),
  theta: z.number(),
  vega: z.number(),
  rho: z.number(),
  isRealTime: z.boolean(),
});
var ZStrategyQuoteResponse = z.object({
  strategyQuotes: z.array(ZStrategyQuote),
});
