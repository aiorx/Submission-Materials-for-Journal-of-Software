// Aided with basic GitHub coding tools
import {
  ZOptionQuoteFilter,
  ZGetOptionQuotesRequest,
  ZOptionQuote,
  ZGetOptionQuotesResponse
} from '../../zod/quotes';

// Mock data for testing
const validOptionQuoteFilter = {
  optionType: 'Call',
  underlyingId: 8049,
  expiryDate: '2023-01-20T00:00:00.000000-05:00',
  minstrikePrice: 145,
  maxstrikePrice: 155
};

const validOptionQuotesRequest = {
  filters: [validOptionQuoteFilter],
  optionIds: [5678901, 5678902]
};

const validOptionQuote = {
  underlying: 'AAPL',
  underlyingId: 8049,
  symbol: 'AAPL230120C00150000',
  symbolId: 5678901,
  bidPrice: 3.50,
  bidSize: 10,
  askPrice: 3.70,
  askSize: 15,
  lastTradePriceTrHrs: 3.60,
  lastTradePrice: 3.60,
  lastTradeSize: 5,
  lastTradeTick: 'Equal',
  lastTradeTime: '2023-01-15T10:30:00.000000-05:00',
  volume: 150,
  openPrice: 3.20,
  highPrice: 3.80,
  lowPrice: 3.10,
  volatility: 25.5,
  delta: 0.65,
  gamma: 0.05,
  theta: -0.08,
  vega: 0.10,
  rho: 0.05,
  openInterest: 500,
  delay: 0,
  isHalted: false,
  VWAP: 3.55
};

const validOptionQuotesResponse = {
  optionQuotes: [validOptionQuote]
};

describe('ZOptionQuoteFilter Schema', () => {
  test('should validate correct option quote filter', () => {
    const result = ZOptionQuoteFilter.safeParse(validOptionQuoteFilter);
    expect(result.success).toBe(true);
  });

  test('should validate filter with required fields only', () => {
    const minimalFilter = {
      underlyingId: 8049,
      expiryDate: '2023-01-20T00:00:00.000000-05:00'
    };
    const result = ZOptionQuoteFilter.safeParse(minimalFilter);
    expect(result.success).toBe(true);
  });

  test('should reject invalid option type', () => {
    const invalidFilter = {
      ...validOptionQuoteFilter,
      optionType: 'Invalid' // Not one of the allowed values
    };
    const result = ZOptionQuoteFilter.safeParse(invalidFilter);
    expect(result.success).toBe(false);
  });
});

describe('ZGetOptionQuotesRequest Schema', () => {
  test('should validate correct option quotes request with filters', () => {
    const result = ZGetOptionQuotesRequest.safeParse(validOptionQuotesRequest);
    expect(result.success).toBe(true);
  });

  test('should validate request with only optionIds', () => {
    const idsOnlyRequest = {
      optionIds: [5678901, 5678902]
    };
    const result = ZGetOptionQuotesRequest.safeParse(idsOnlyRequest);
    expect(result.success).toBe(true);
  });

  test('should validate empty request', () => {
    // The schema allows both filters and optionIds to be optional
    const emptyRequest = {};
    const result = ZGetOptionQuotesRequest.safeParse(emptyRequest);
    expect(result.success).toBe(true);
  });
});

describe('ZOptionQuote Schema', () => {
  test('should validate correct option quote', () => {
    const result = ZOptionQuote.safeParse(validOptionQuote);
    expect(result.success).toBe(true);
  });

  test('should reject invalid tick type', () => {
    const invalidQuote = {
      ...validOptionQuote,
      lastTradeTick: 'Invalid' // Not one of the allowed values
    };
    const result = ZOptionQuote.safeParse(invalidQuote);
    expect(result.success).toBe(false);
  });
});

describe('ZGetOptionQuotesResponse Schema', () => {
  test('should validate correct option quotes response', () => {
    const result = ZGetOptionQuotesResponse.safeParse(validOptionQuotesResponse);
    expect(result.success).toBe(true);
  });
});
