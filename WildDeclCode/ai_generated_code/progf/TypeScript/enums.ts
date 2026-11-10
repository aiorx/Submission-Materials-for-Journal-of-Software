// Supported via standard GitHub programming aids
import { z } from 'zod';

// --- Enums ---
export const ZOptionType = z.enum(['Call', 'Put']);
export const ZOrderAction = z.enum(['Buy', 'Sell']);
export const ZTickType = z.enum(['Up', 'Down', 'Equal']);
export const ZStrategyType = z.enum([
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
]);
