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
const validSymbolSearchRequest = {
    prefix: 'AAP',
    offset: 0
};

const validEquitySymbol = {
    symbol: 'AAPL',
    symbolId: 8049,
    description: 'Apple Inc.',
    securityType: 'Stock',
    listingExchange: 'NASDAQ',
    isQuotable: true,
    isTradable: true,
    currency: 'USD'
};

const validSymbolSearchResponse = {
    symbols: [validEquitySymbol]
};

const validMinTickData = {
    pivot: 1.0,
    minTick: 0.01
};

const validUnderlyingMultiplierPair = {
    multiplier: 100,
    underlyingSymbol: 'AAPL',
    underlyingSymbolId: 8049
};

const validOptionContractDeliverables = {
    underlyings: [validUnderlyingMultiplierPair],
    cashInLieu: 0
};

const validSymbolInfo = {
    symbol: 'AAPL',
    symbolId: 8049,
    description: 'Apple Inc.',
    securityType: 'Stock',
    listingExchange: 'NASDAQ',
    minTicks: [validMinTickData]
};

const validOptionSymbolInfo = {
    ...validSymbolInfo,
    securityType: 'Option',
    optionContractDeliverables: validOptionContractDeliverables
};

const validGetSymbolByIdResponse = {
    symbols: [validSymbolInfo]
};

const validChainPerStrikePrice = {
    strikePrice: 150,
    callSymbolId: 5678901,
    putSymbolId: 5678902
};

const validChainPerRoot = {
    root: 'AAPL',
    multiplier: 100,
    chainPerStrikePrice: [validChainPerStrikePrice]
};

const validChainPerExpiryDate = {
    expiryDate: '2023-01-20T00:00:00.000000-05:00',
    description: 'Jan 20, 2023',
    listingExchange: 'OPRA',
    optionExerciseType: 'American',
    chainPerRoot: [validChainPerRoot]
};

const validGetSymbolOptionsResponse = {
    options: [validChainPerExpiryDate]
};

describe('ZSymbolSearchRequest Schema', () => {
    test('should validate correct symbol search request', () => {
        const result = ZSymbolSearchRequest.safeParse(validSymbolSearchRequest);
        expect(result.success).toBe(true);
    });

    test('should validate request with only required fields', () => {
        const result = ZSymbolSearchRequest.safeParse({ prefix: 'AAP' });
        expect(result.success).toBe(true);
    });
});

describe('ZEquitySymbol Schema', () => {
    test('should validate correct equity symbol', () => {
        const result = ZEquitySymbol.safeParse(validEquitySymbol);
        expect(result.success).toBe(true);
    });
});

describe('ZSymbolSearchResponse Schema', () => {
    test('should validate correct symbol search response', () => {
        const result = ZSymbolSearchResponse.safeParse(validSymbolSearchResponse);
        expect(result.success).toBe(true);
    });
});

describe('ZMinTickData Schema', () => {
    test('should validate correct min tick data', () => {
        const result = ZMinTickData.safeParse(validMinTickData);
        expect(result.success).toBe(true);
    });
});

describe('ZUnderlyingMultiplierPair Schema', () => {
    test('should validate correct underlying multiplier pair', () => {
        const result = ZUnderlyingMultiplierPair.safeParse(validUnderlyingMultiplierPair);
        expect(result.success).toBe(true);
    });
});

describe('ZOptionContractDeliverables Schema', () => {
    test('should validate correct option contract deliverables', () => {
        const result = ZOptionContractDeliverables.safeParse(validOptionContractDeliverables);
        expect(result.success).toBe(true);
    });
});

describe('ZSymbolInfo Schema', () => {
    test('should validate correct symbol info for stock', () => {
        const result = ZSymbolInfo.safeParse(validSymbolInfo);
        expect(result.success).toBe(true);
    });

    test('should validate correct symbol info for option', () => {
        const result = ZSymbolInfo.safeParse(validOptionSymbolInfo);
        expect(result.success).toBe(true);
    });
});

describe('ZGetSymbolByIdResponse Schema', () => {
    test('should validate correct get symbol by ID response', () => {
        const result = ZGetSymbolByIdResponse.safeParse(validGetSymbolByIdResponse);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerStrikePrice Schema', () => {
    test('should validate correct chain per strike price', () => {
        const result = ZChainPerStrikePrice.safeParse(validChainPerStrikePrice);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerRoot Schema', () => {
    test('should validate correct chain per root', () => {
        const result = ZChainPerRoot.safeParse(validChainPerRoot);
        expect(result.success).toBe(true);
    });
});

describe('ZChainPerExpiryDate Schema', () => {
    test('should validate correct chain per expiry date', () => {
        const result = ZChainPerExpiryDate.safeParse(validChainPerExpiryDate);
        expect(result.success).toBe(true);
    });
});

describe('ZGetSymbolOptionsResponse Schema', () => {
    test('should validate correct get symbol options response', () => {
        const result = ZGetSymbolOptionsResponse.safeParse(validGetSymbolOptionsResponse);
        expect(result.success).toBe(true);
    });
});
