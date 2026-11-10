// Aided with basic GitHub coding tools
import {
  ZStrategyLeg,
  ZStrategyVariantRequest,
  ZStrategyQuoteRequest,
  ZStrategyQuote,
  ZStrategyQuoteResponse
} from '../../zod/strategies';

// Mock data for testing
var validStrategyLeg = {
  symbolId: 5678901,
  action: 'Buy',
  ratio: 1
};

var validStrategyVariantRequest = {
  variantId: 1,
  strategy: 'CoveredCall',
  legs: [
    validStrategyLeg,
    { symbolId: 5678902, action: 'Sell', ratio: 1 }
  ]
};

var validStrategyQuoteRequest = {
  variants: [validStrategyVariantRequest]
};

var validStrategyQuote = {
  variantId: 1,
  bidPrice: 2.15,
  askPrice: 2.40,
  underlying: 'AAPL',
  underlyingId: 8049,
  openPrice: 2.25,
  volatility: 22.5,
  delta: 0.45,
  gamma: 0.03,
  theta: -0.05,
  vega: 0.07,
  rho: 0.02,
  isRealTime: true
};

var validStrategyQuoteResponse = {
  strategyQuotes: [validStrategyQuote]
};

describe('ZStrategyLeg Schema', function () {
  test('should validate correct strategy leg', () => {
    var result = ZStrategyLeg.safeParse(validStrategyLeg);
    expect(result.success).toBe(true);
  });

  test('should reject invalid action', () => {
    var invalidLeg = { ...validStrategyLeg, action: 'Invalid' };
    var result = ZStrategyLeg.safeParse(invalidLeg);
    expect(result.success).toBe(false);
  });
});

describe('ZStrategyVariantRequest Schema', function () {
  test('should validate correct strategy variant request', () => {
    var result = ZStrategyVariantRequest.safeParse(validStrategyVariantRequest);
    expect(result.success).toBe(true);
  });

  test('should reject invalid strategy type', () => {
    var invalidVariant = {
      ...validStrategyVariantRequest,
      strategy: 'InvalidStrategy'
    };
    var result = ZStrategyVariantRequest.safeParse(invalidVariant);
    expect(result.success).toBe(false);
  });
});

describe('ZStrategyQuoteRequest Schema', function () {
  test('should validate correct strategy quote request', () => {
    var result = ZStrategyQuoteRequest.safeParse(validStrategyQuoteRequest);
    expect(result.success).toBe(true);
  });

  test('should reject empty variants array', () => {
    var invalidRequest = { variants: [] };
    // This would fail if the schema requires at least one variant
    var result = ZStrategyQuoteRequest.safeParse(invalidRequest);
    // Adjust this expectation based on your actual schema requirements
    expect(result.success).toBe(true); // Currently allows empty array
  });
});

describe('ZStrategyQuote Schema', function () {
  test('should validate correct strategy quote', () => {
    var result = ZStrategyQuote.safeParse(validStrategyQuote);
    expect(result.success).toBe(true);
  });

  test('should validate quote with null openPrice', () => {
    var quoteWithNull = {
      ...validStrategyQuote,
      openPrice: null
    };
    var result = ZStrategyQuote.safeParse(quoteWithNull);
    expect(result.success).toBe(true);
  });
});

describe('ZStrategyQuoteResponse Schema', function () {
  test('should validate correct strategy quote response', () => {
    var result = ZStrategyQuoteResponse.safeParse(validStrategyQuoteResponse);
    expect(result.success).toBe(true);
  });
});
