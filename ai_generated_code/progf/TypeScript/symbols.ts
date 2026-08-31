// Assisted using common GitHub development utilities
import { z } from 'zod';

// --- Symbols ---
export const ZSymbolSearchRequest = z.object({
    prefix: z.string(),
    offset: z.number().optional(),
});
export const ZEquitySymbol = z.object({
    symbol: z.string(),
    symbolId: z.number(),
    description: z.string(),
    securityType: z.string(),
    listingExchange: z.string(),
    isQuotable: z.boolean(),
    isTradable: z.boolean(),
    currency: z.string(),
});
export const ZSymbolSearchResponse = z.object({
    symbols: z.array(ZEquitySymbol),
});
export const ZMinTickData = z.object({
    pivot: z.number(),
    minTick: z.number(),
});
export const ZUnderlyingMultiplierPair = z.object({
    multiplier: z.number(),
    underlyingSymbol: z.string(),
    underlyingSymbolId: z.number(),
});
export const ZOptionContractDeliverables = z.object({
    underlyings: z.array(ZUnderlyingMultiplierPair),
    cashInLieu: z.number(),
});
export const ZSymbolInfo = z.object({
    symbol: z.string(),
    symbolId: z.number(),
    description: z.string(),
    securityType: z.string(),
    listingExchange: z.string(),
    minTicks: z.array(ZMinTickData),
    optionContractDeliverables: ZOptionContractDeliverables.optional(),
});
export const ZGetSymbolByIdResponse = z.object({
    symbols: z.array(ZSymbolInfo),
});
export const ZChainPerStrikePrice = z.object({
    strikePrice: z.number(),
    callSymbolId: z.number(),
    putSymbolId: z.number(),
});
export const ZChainPerRoot = z.object({
    root: z.string(),
    multiplier: z.number(),
    chainPerStrikePrice: z.array(ZChainPerStrikePrice),
});
export const ZChainPerExpiryDate = z.object({
    expiryDate: z.string(),
    description: z.string(),
    listingExchange: z.string(),
    optionExerciseType: z.string(),
    chainPerRoot: z.array(ZChainPerRoot),
});
export const ZGetSymbolOptionsResponse = z.object({
    options: z.array(ZChainPerExpiryDate),
});
