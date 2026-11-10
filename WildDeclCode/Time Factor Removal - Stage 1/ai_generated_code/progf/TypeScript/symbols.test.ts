// Supported via standard GitHub programming aids
import {
    ZSymbolSearchRequest,
    ZEquitySymbol,
    ZSymbolSearchResponse,
    ZMinTickData,
    ZUnderlyingMultiplierPair,
    ZOptionContractDeliverables,
    ZSymbolInfo,
    ZGetSymbolByIdResponse,
    ZChainPerStrikePrice,
    ZChainPerRoot,
    ZChainPerExpiryDate,
    ZGetSymbolOptionsResponse
} from '../../zod/symbols';

// Mock data for testing
var validSymbolSearchRequest = {
    prefix: 'AAP',
    offset: 0
};

var validEquitySymbol = {
    symbol: 'AAPL',
    symbolId: 8049,
    description: 'Apple Inc.',
    securityType: 'Stock',
    listingExchange: 'NASDAQ',
    isQuotable: true,
    isTradable: true,
    currency: 'USD'
};

var validSymbolSearchResponse = {
    symbols: [validEquitySymbol]
};

var validMinTickData = {
    pivot: 1.0,
    minTick: 0.01
};

var validUnderlyingMultiplierPair = {
    multiplier: 100,
    underlyingSymbol: 'AAPL',
    underlyingSymbolId: 8049
};

var validOptionContractDeliverables = {
    underlyings: [validUnderlyingMultiplierPair],
    cashInLieu: 0
};

var validSymbolInfo = {
    symbol: 'AAPL',
    symbolId: 8049,
    description: 'Apple Inc.',
    securityType: 'Stock',
    listingExchange: 'NASDAQ',
    minTicks: [validMinTickData]
};

var validOptionSymbolInfo = {
    ...validSymbolInfo,
    securityType: 'Option',
    optionContractDeliverables: validOptionContractDeliverables
};

var validGetSymbolByIdResponse = {
    symbols: [validSymbolInfo]
};

var validChainPerStrikePrice = {
    strikePrice: 150,
    callSymbolId: 5678901,
    putSymbolId: 5678902
};

var validChainPerRoot = {
    root: 'AAPL',
    multiplier: 100,
    chainPerStrikePrice: [validChainPerStrikePrice]
};

var validChainPerExpiryDate = {
    expiryDate: '2023-01-20T00:00:00.000000-05:00',
    description: 'Jan 20, 2023',
    listingExchange: 'OPRA',
    optionExerciseType: 'American',
    chainPerRoot: [validChainPerRoot]
};

var validGetSymbolOptionsResponse = {
    options: [validChainPerExpiryDate]
};

describe('ZSymbolSearchRequest Schema', function () {
    test('should validate correct symbol search request', () => {
        var result = ZSymbolSearchRequest.safeParse(validSymbolSearchRequest);
        expect(result.success).toBe(true);
    });

    test('should validate request with only required fields', () => {
        var result = ZSymbolSearchRequest.safeParse({ prefix: 'AAP' });
        expect(result.success).toBe(true);
    });
});

describe('ZEquitySymbol Schema', function () {
    test('should validate correct equity symbol', () => {
        var result = ZEquitySymbol.safeParse(validEquitySymbol);
        expect(result.success).toBe(true);
    });
});

describe('ZSymbolSearchResponse Schema', function () {
    test('should validate correct symbol search response', () => {
        var result = ZSymbolSearchResponse.safeParse(validSymbolSearchResponse);
        expect(result.success).toBe(true);
    });
});

describe('ZMinTickData Schema', function () {
    test('should validate correct min tick data', () => {
        var result = ZMinTickData.safeParse(validMinTickData);
        expect(result.success).toBe(true);
    });
});

describe('ZUnderlyingMultiplierPair Schema', function () {
    test('should validate correct underlying multiplier pair', () => {
        var result = ZUnderlyingMultiplierPair.safeParse(validUnderlyingMultiplierPair);
        expect(result.success).toBe(true);
    });
});

describe('ZOptionContractDeliverables Schema', function () {
    test('should validate correct option contract deliverables', () => {
        var result = ZOptionContractDeliverables.safeParse(validOptionContractDeliverables);
        expect(result.success).toBe(true);
    });
});

describe('ZSymbolInfo Schema', function () {
    test('should validate correct symbol info for stock', () => {
        var result = ZSymbolInfo.safeParse(validSymbolInfo);
        expect(result.success).toBe(true);
    });

    test('should validate correct symbol info for option', () => {
        var result = ZSymbolInfo.safeParse(validOptionSymbolInfo);
        expect(result.success).toBe(true);
    });
});

describe('ZGetSymbolByIdResponse Schema', function () {
    test('should validate correct get symbol by ID response', () => {
        var result = ZGetSymbolByIdResponse.safeParse(validGetSymbolByIdResponse);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerStrikePrice Schema', function () {
    test('should validate correct chain per strike price', () => {
        var result = ZChainPerStrikePrice.safeParse(validChainPerStrikePrice);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerRoot Schema', function () {
    test('should validate correct chain per root', () => {
        var result = ZChainPerRoot.safeParse(validChainPerRoot);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerExpiryDate Schema', function () {
    test('should validate correct chain per expiry date', () => {
        var result = ZChainPerExpiryDate.safeParse(validChainPerExpiryDate);
        expect(result.success).toBe(true);
    });
});

describe('ZGetSymbolOptionsResponse Schema', function () {
    test('should validate correct get symbol options response', () => {
        var result = ZGetSymbolOptionsResponse.safeParse(validGetSymbolOptionsResponse);
        expect(result.success).toBe(true);
    });
});
