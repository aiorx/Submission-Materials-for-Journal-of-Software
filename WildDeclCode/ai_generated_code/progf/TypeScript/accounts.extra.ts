// Assisted using common GitHub development utilities
import { z } from 'zod';

// --- Activities ---
export const ZGetAccountActivitiesRequest = z.object({
    accountId: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});
export const ZAccountActivity = z.object({
    tradeDate: z.string(),
    transactionDate: z.string(),
    settlementDate: z.string(),
    action: z.string(),
    symbol: z.string(),
    symbolId: z.number(),
    description: z.string(),
    currency: z.string(),
    quantity: z.number(),
    price: z.number(),
    grossAmount: z.number(),
    commission: z.number(),
    netAmount: z.number(),
    type: z.string(),
});
export const ZGetAccountActivitiesResponse = z.object({
    activities: z.array(ZAccountActivity),
});

// --- Orders ---
export const ZGetAccountOrdersRequest = z.object({
    accountId: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    stateFilter: z.enum(['All', 'Open', 'Closed']).optional(),
    orderId: z.number().optional(),
});
export const ZOrder = z.object({
    id: z.number(),
    symbol: z.string(),
    symbolId: z.number(),
    totalQuantity: z.number(),
    openQuantity: z.number(),
    filledQuantity: z.number(),
    canceledQuantity: z.number(),
    side: z.string(),
    orderType: z.string(),
    limitPrice: z.number().optional(),
    stopPrice: z.number().optional(),
    isAllOrNone: z.boolean(),
    isAnonymous: z.boolean(),
    icebergQuantity: z.number().optional(),
    minQuantity: z.number().optional(),
    avgExecPrice: z.number().optional(),
    lastExecPrice: z.number().optional(),
    source: z.string(),
    timeInForce: z.string(),
    gtdDate: z.string().optional(),
    state: z.string(),
    clientReasonStr: z.string().optional(),
    chainId: z.number(),
    creationTime: z.string(),
    updateTime: z.string(),
    notes: z.string().optional(),
    primaryRoute: z.string(),
    secondaryRoute: z.string().optional(),
    orderRoute: z.string(),
    venueHoldingOrder: z.string().optional(),
    commissionCharged: z.number(),
    exchangeOrderId: z.string(),
    isSignificantShareholder: z.boolean(),
    isInsider: z.boolean(),
    isLimitOffsetInDollar: z.boolean(),
    userId: z.number(),
    placementCommission: z.number().optional(),
    strategyType: z.string(),
    mainChainId: z.number().optional(),
    legs: z.array(z.any()),
});
export const ZGetAccountOrdersResponse = z.object({
    orders: z.array(ZOrder),
});

// --- Executions ---
export const ZGetAccountExecutionsRequest = z.object({
    accountId: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});
export const ZExecution = z.object({
    symbol: z.string(),
    symbolId: z.number(),
    quantity: z.number(),
    side: z.string(),
    price: z.number(),
    id: z.number(),
    orderId: z.number(),
    orderChainId: z.number(),
    exchangeExecId: z.string(),
    timestamp: z.string(),
    notes: z.string().optional(),
    venue: z.string(),
    totalCost: z.number(),
    orderPlacementCommission: z.number(),
    commission: z.number(),
    executionFee: z.number(),
    secFee: z.number(),
    canadianExecutionFee: z.number(),
    parentId: z.number(),
});
export const ZGetAccountExecutionsResponse = z.object({
    executions: z.array(ZExecution),
});
