// Assisted using common GitHub development utilities
var z = require('zod').z;

// --- Symbols ---
var ZSymbolSearchRequest = z.object({
    prefix: z.string(),
    offset: z.number().optional(),
});
var ZEquitySymbol = z.object({
    symbol: z.string(),
    symbolId: z.number(),
    description: z.string(),
    securityType: z.string(),
    listingExchange: z.string(),
    isQuotable: z.boolean(),
    isTradable: z.boolean(),
    currency: z.string(),
});
var ZSymbolSearchResponse = z.object({
    symbols: z.array(ZEquitySymbol),
});
var ZMinTickData = z.object({
    pivot: z.number(),
    minTick: z.number(),
});
var ZUnderlyingMultiplierPair = z.object({
    multiplier: z.number(),
    underlyingSymbol: z.string(),
    underlyingSymbolId: z.number(),
});
var ZOptionContractDeliverables = z.object({
    underlyings: z.array(ZUnderlyingMultiplierPair),
    cashInLieu: z.number(),
});
var ZSymbolInfo = z.object({
    symbol: z.string(),
    symbolId: z.number(),
    description: z.string(),
    securityType: z.string(),
    listingExchange: z.string(),
    minTicks: z.array(ZMinTickData),
    optionContractDeliverables: ZOptionContractDeliverables.optional(),
});
var ZGetSymbolByIdResponse = z.object({
    symbols: z.array(ZSymbolInfo),
});
var ZChainPerStrikePrice = z.object({
    strikePrice: z.number(),
    callSymbolId: z.number(),
    putSymbolId: z.number(),
});
var ZChainPerRoot = z.object({
    root: z.string(),
    multiplier: z.number(),
    chainPerStrikePrice: z.array(ZChainPerStrikePrice),
});
var ZChainPerExpiryDate = z.object({
    expiryDate: z.string(),
    description: z.string(),
    listingExchange: z.string(),
    optionExerciseType: z.string(),
    chainPerRoot: z.array(ZChainPerRoot),
});
var ZGetSymbolOptionsResponse = z.object({
    options: z.array(ZChainPerExpiryDate),
});
