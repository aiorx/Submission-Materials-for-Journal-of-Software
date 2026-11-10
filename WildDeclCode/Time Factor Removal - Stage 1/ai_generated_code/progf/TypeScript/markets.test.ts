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
var validMarket = {
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

var validMarketsResponse = {
  markets: [validMarket]
};

var validCandle = {
  start: '2023-01-15T09:30:00.000000-05:00',
  end: '2023-01-15T09:31:00.000000-05:00',
  open: 150.25,
  high: 150.75,
  low: 150.20,
  close: 150.50,
  volume: 15000
};

var validCandlesResponse = {
  candles: [validCandle]
};

var validCandlesRequest = {
  id: 8049,
  startTime: '2023-01-15T09:30:00.000000-05:00',
  endTime: '2023-01-15T09:45:00.000000-05:00',
  interval: 'OneMinute'
};

var validQuote = {
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

var validQuotesResponse = {
  quotes: [validQuote]
};

describe('ZMarket Schema', function () {
  test('should validate correct market data', () => {
    var result = ZMarket.safeParse(validMarket);
    expect(result.success).toBe(true);
  });

  test('should reject invalid market data', () => {
    var invalidMarket = {
      ...validMarket,
      tradingVenues: 'not-an-array', // Wrong type
      snapQuotesLimit: 'not-a-number' // Wrong type
    };
    var result = ZMarket.safeParse(invalidMarket);
    expect(result.success).toBe(false);
  });
});

describe('ZGetMarketsResponse Schema', function () {
  test('should validate correct markets response', () => {
    var result = ZGetMarketsResponse.safeParse(validMarketsResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZCandle Schema', function () {
  test('should validate correct candle data', () => {
    var result = ZCandle.safeParse(validCandle);
    expect(result.success).toBe(true);
  });

  test('should reject invalid candle data', () => {
    var invalidCandle = {
      ...validCandle,
      open: 'not-a-number', // Wrong type
      volume: -100 // Could be invalid based on business rules
    };
    var result = ZCandle.safeParse(invalidCandle);
    expect(result.success).toBe(false);
  });
});

describe('ZMarketCandlesResponse Schema', function () {
  test('should validate correct candles response', () => {
    var result = ZMarketCandlesResponse.safeParse(validCandlesResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZMarketCandlesRequest Schema', function () {
  test('should validate correct candles request', () => {
    var result = ZMarketCandlesRequest.safeParse(validCandlesRequest);
    expect(result.success).toBe(true);
  });

  test('should reject invalid candles request', () => {
    var invalidRequest = {
      ...validCandlesRequest,
      id: 'not-a-number', // Wrong type
      interval: 123 // Wrong type
    };
    var result = ZMarketCandlesRequest.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});

describe('ZQuote Schema', function () {
  test('should validate correct quote data', () => {
    var result = ZQuote.safeParse(validQuote);
    expect(result.success).toBe(true);
  });

  test('should validate quote with optional fields', () => {
    var quoteWithOptionals = {
      ...validQuote,
      tier: 'TSX',
      lastTradePriceTrHrs: 150.40,
      lastTradeTime: '2023-01-15T09:45:00.000000-05:00'
    };
    var result = ZQuote.safeParse(quoteWithOptionals);
    expect(result.success).toBe(true);
  });
});

describe('ZGetMarketQuotesResponse Schema', function () {
  test('should validate correct quotes response', () => {
    var result = ZGetMarketQuotesResponse.safeParse(validQuotesResponse);
    expect(result.success).toBe(true);
  });
});
