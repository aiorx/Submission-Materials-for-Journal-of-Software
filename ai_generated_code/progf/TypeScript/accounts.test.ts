// Assisted using common GitHub development utilities
import { ZAccount, ZBalance, ZGetAccountBalancesResponse, ZGetAccountsResponse, ZPosition, ZGetAccountPositionsResponse } from '../../zod/accounts';

// Mock data for testing
const validAccount = {
  type: 'Margin',
  number: '26598145',
  status: 'Active',
  isPrimary: true,
  isBilling: true,
  clientAccountType: 'Individual',
};

const invalidAccount = {
  type: 'Margin',
  number: '26598145',
  // Missing required status field
  isPrimary: 'not-a-boolean', // Wrong type
  isBilling: true,
  clientAccountType: 'Individual',
};

const validAccountsResponse = {
  accounts: [validAccount],
  userId: 12345,
};

const validBalance = {
  currency: 'CAD',
  cash: 243971.7,
  marketValue: 6017,
  totalEquity: 249988.7,
  buyingPower: 496367.2,
  maintenanceExcess: 248183.6,
  isRealTime: false,
};

const validBalancesResponse = {
  perCurrencyBalances: [validBalance],
  combinedBalances: [validBalance],
  sodPerCurrencyBalances: [validBalance],
  sodCombinedBalances: [validBalance],
};

const validPosition = {
  symbol: 'THI.TO',
  symbolId: 38738,
  openQuantity: 100,
  currentMarketValue: 6017,
  currentPrice: 60.17,
  averageEntryPrice: 60.23,
  closedPnl: 0,
  openPnl: -6,
  totalCost: 6023,
  isRealTime: false,
  isUnderReorg: false,
};

const validPositionsResponse = {
  positions: [validPosition],
};

describe('ZAccount Schema', () => {
  test('should validate correct account data', () => {
    const result = ZAccount.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  test('should reject invalid account data', () => {
    const result = ZAccount.safeParse(invalidAccount);
    expect(result.success).toBe(false);

    if (!result.success) {
      // Optional: Verify specific error messages
      const formattedError = result.error.format();
      expect(formattedError.status?._errors).toBeDefined();
      expect(formattedError.isPrimary?._errors).toBeDefined();
    }
  });
});

describe('ZGetAccountsResponse Schema', () => {
  test('should validate correct accounts response data', () => {
    const result = ZGetAccountsResponse.safeParse(validAccountsResponse);
    expect(result.success).toBe(true);
  });

  test('should reject response with invalid account data', () => {
    const result = ZGetAccountsResponse.safeParse({
      accounts: [invalidAccount],
      userId: 12345,
    });
    expect(result.success).toBe(false);
  });
});

describe('ZBalance Schema', () => {
  test('should validate correct balance data', () => {
    const result = ZBalance.safeParse(validBalance);
    expect(result.success).toBe(true);
  });

  test('should reject invalid balance data', () => {
    const invalidBalance = { ...validBalance, isRealTime: 'not-a-boolean' };
    const result = ZBalance.safeParse(invalidBalance);
    expect(result.success).toBe(false);
  });
});

describe('ZGetAccountBalancesResponse Schema', () => {
  test('should validate correct balances response data', () => {
    const result = ZGetAccountBalancesResponse.safeParse(validBalancesResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZPosition Schema', () => {
  test('should validate correct position data', () => {
    const result = ZPosition.safeParse(validPosition);
    expect(result.success).toBe(true);
  });

  test('should validate position data with optional closedQuantity', () => {
    const positionWithClosed = { ...validPosition, closedQuantity: 50 };
    const result = ZPosition.safeParse(positionWithClosed);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountPositionsResponse Schema', () => {
  test('should validate correct positions response data', () => {
    const result = ZGetAccountPositionsResponse.safeParse(validPositionsResponse);
    expect(result.success).toBe(true);
  });
});
