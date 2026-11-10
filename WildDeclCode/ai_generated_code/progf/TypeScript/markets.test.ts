// Assisted using common GitHub development utilities
import {
  ZMarket,
  ZGetMarketsResponse,
  ZCandle,
  ZMarketCandlesResponse,
  ZMarketCandlesRequest,
  ZQuote,
  ZGetMarketQuotesResponse
} from '../../zod/markets';

// Mock data for testing
const validMarket = {
  name: 'TSX',
  tradingVenues: ['TSX', 'TSXV'],
  defaultTradingVenue: 'TSX',
  primaryOrderRoutes: ['AUTO'],
  secondaryOrderRoutes: ['LAMP', 'EDGE'],
  level1Feeds: ['TSX', 'TSXV'],
  level2Feeds: ['TSX_MKT', 'TSXV_MKT'],
  extendedStartTime: '04:00:00.000000-05:00',
  startTime: '09:30:00.000000-05:00',
  endTime: '16:00:00.000000-05:00',
  extendedEndTime: '20:00:00.000000-05:00',
  currency: 'CAD',
  snapQuotesLimit: 500
};

const validMarketsResponse = {
  markets: [validMarket]
};

const validCandle = {
  start: '2023-01-15T09:30:00.000000-05:00',
  end: '2023-01-15T09:31:00.000000-05:00',
  open: 150.25,
  high: 150.75,
  low: 150.20,
  close: 150.50,
  volume: 15000
};

const validCandlesResponse = {
  candles: [validCandle]
};

const validCandlesRequest = {
  id: 8049,
  startTime: '2023-01-15T09:30:00.000000-05:00',
  endTime: '2023-01-15T09:45:00.000000-05:00',
  interval: 'OneMinute'
};

const validQuote = {
  symbol: 'AAPL',
  symbolId: 8049,
  bidPrice: 150.25,
  bidSize: 500,
  askPrice: 150.50,
  askSize: 700,
  lastTradePrice: 150.35,
  lastTradeSize: 100,
  lastTradeTick: 'Up',
  volume: 5000000,
  openPrice: 149.25,
  highPrice: 151.50,
  lowPrice: 148.75,
  delay: false,
  isHalted: false
};

const validQuotesResponse = {
  quotes: [validQuote]
};

describe('ZMarket Schema', () => {
  test('should validate correct market data', () => {
    const result = ZMarket.safeParse(validMarket);
    expect(result.success).toBe(true);
  });

  test('should reject invalid market data', () => {
    const invalidMarket = {
      ...validMarket,
      tradingVenues: 'not-an-array', // Wrong type
      snapQuotesLimit: 'not-a-number' // Wrong type
    };
    const result = ZMarket.safeParse(invalidMarket);
    expect(result.success).toBe(false);
  });
});

describe('ZGetMarketsResponse Schema', () => {
  test('should validate correct markets response', () => {
    const result = ZGetMarketsResponse.safeParse(validMarketsResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZCandle Schema', () => {
  test('should validate correct candle data', () => {
    const result = ZCandle.safeParse(validCandle);
    expect(result.success).toBe(true);
  });

  test('should reject invalid candle data', () => {
    const invalidCandle = {
      ...validCandle,
      open: 'not-a-number', // Wrong type
      volume: -100 // Could be invalid based on business rules
    };
    const result = ZCandle.safeParse(invalidCandle);
    expect(result.success).toBe(false);
  });
});

describe('ZMarketCandlesResponse Schema', () => {
  test('should validate correct candles response', () => {
    const result = ZMarketCandlesResponse.safeParse(validCandlesResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZMarketCandlesRequest Schema', () => {
  test('should validate correct candles request', () => {
    const result = ZMarketCandlesRequest.safeParse(validCandlesRequest);
    expect(result.success).toBe(true);
  });

  test('should reject invalid candles request', () => {
    const invalidRequest = {
      ...validCandlesRequest,
      id: 'not-a-number', // Wrong type
      interval: 123 // Wrong type
    };
    const result = ZMarketCandlesRequest.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});

describe('ZQuote Schema', () => {
  test('should validate correct quote data', () => {
    const result = ZQuote.safeParse(validQuote);
    expect(result.success).toBe(true);
  });

  test('should validate quote with optional fields', () => {
    const quoteWithOptionals = {
      ...validQuote,
      tier: 'TSX',
      lastTradePriceTrHrs: 150.40,
      lastTradeTime: '2023-01-15T09:45:00.000000-05:00'
    };
    const result = ZQuote.safeParse(quoteWithOptionals);
    expect(result.success).toBe(true);
  });
});

describe('ZGetMarketQuotesResponse Schema', () => {
  test('should validate correct quotes response', () => {
    const result = ZGetMarketQuotesResponse.safeParse(validQuotesResponse);
    expect(result.success).toBe(true);
  });
});
