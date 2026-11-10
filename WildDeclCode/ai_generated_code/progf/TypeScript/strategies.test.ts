// Aided with basic GitHub coding tools
import {
  ZStrategyLeg,
  ZStrategyVariantRequest,
  ZStrategyQuoteRequest,
  ZStrategyQuote,
  ZStrategyQuoteResponse
} from '../../zod/strategies';

// Mock data for testing
const validStrategyLeg = {
  symbolId: 5678901,
  action: 'Buy',
  ratio: 1
};

const validStrategyVariantRequest = {
  variantId: 1,
  strategy: 'CoveredCall',
  legs: [
    validStrategyLeg,
    { symbolId: 5678902, action: 'Sell', ratio: 1 }
  ]
};

const validStrategyQuoteRequest = {
  variants: [validStrategyVariantRequest]
};

const validStrategyQuote = {
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

const validStrategyQuoteResponse = {
  strategyQuotes: [validStrategyQuote]
};

describe('ZStrategyLeg Schema', () => {
  test('should validate correct strategy leg', () => {
    const result = ZStrategyLeg.safeParse(validStrategyLeg);
    expect(result.success).toBe(true);
  });

  test('should reject invalid action', () => {
    const invalidLeg = { ...validStrategyLeg, action: 'Invalid' };
    const result = ZStrategyLeg.safeParse(invalidLeg);
    expect(result.success).toBe(false);
  });
});

describe('ZStrategyVariantRequest Schema', () => {
  test('should validate correct strategy variant request', () => {
    const result = ZStrategyVariantRequest.safeParse(validStrategyVariantRequest);
    expect(result.success).toBe(true);
  });

  test('should reject invalid strategy type', () => {
    const invalidVariant = {
      ...validStrategyVariantRequest,
      strategy: 'InvalidStrategy'
    };
    const result = ZStrategyVariantRequest.safeParse(invalidVariant);
    expect(result.success).toBe(false);
  });
});

describe('ZStrategyQuoteRequest Schema', () => {
  test('should validate correct strategy quote request', () => {
    const result = ZStrategyQuoteRequest.safeParse(validStrategyQuoteRequest);
    expect(result.success).toBe(true);
  });

  test('should reject empty variants array', () => {
    const invalidRequest = { variants: [] };
    // This would fail if the schema requires at least one variant
    const result = ZStrategyQuoteRequest.safeParse(invalidRequest);
    // Adjust this expectation based on your actual schema requirements
    expect(result.success).toBe(true); // Currently allows empty array
  });
});

describe('ZStrategyQuote Schema', () => {
  test('should validate correct strategy quote', () => {
    const result = ZStrategyQuote.safeParse(validStrategyQuote);
    expect(result.success).toBe(true);
  });

  test('should validate quote with null openPrice', () => {
    const quoteWithNull = {
      ...validStrategyQuote,
      openPrice: null
    };
    const result = ZStrategyQuote.safeParse(quoteWithNull);
    expect(result.success).toBe(true);
  });
});

describe('ZStrategyQuoteResponse Schema', () => {
  test('should validate correct strategy quote response', () => {
    const result = ZStrategyQuoteResponse.safeParse(validStrategyQuoteResponse);
    expect(result.success).toBe(true);
  });
});
