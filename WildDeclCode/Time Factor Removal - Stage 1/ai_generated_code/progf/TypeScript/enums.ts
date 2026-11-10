// Supported via standard GitHub programming aids
var z = require('zod').z;

// --- Enums ---
var ZOptionType = z.enum(['Call', 'Put']);
var ZOrderAction = z.enum(['Buy', 'Sell']);
var ZTickType = z.enum(['Up', 'Down', 'Equal']);
var ZStrategyType = z.enum([
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
