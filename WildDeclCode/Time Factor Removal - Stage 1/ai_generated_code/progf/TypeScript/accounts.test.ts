// Assisted using common GitHub development utilities
var ZAccount = require('../../zod/accounts').ZAccount;
var ZBalance = require('../../zod/accounts').ZBalance;
var ZGetAccountBalancesResponse = require('../../zod/accounts').ZGetAccountBalancesResponse;
var ZGetAccountsResponse = require('../../zod/accounts').ZGetAccountsResponse;
var ZPosition = require('../../zod/accounts').ZPosition;
var ZGetAccountPositionsResponse = require('../../zod/accounts').ZGetAccountPositionsResponse;

// Mock data for testing
var validAccount = {
  type: 'Margin',
  number: '26598145',
  status: 'Active',
  isPrimary: true,
  isBilling: true,
  clientAccountType: 'Individual',
};

var invalidAccount = {
  type: 'Margin',
  number: '26598145',
  // Missing required status field
  isPrimary: 'not-a-boolean', // Wrong type
  isBilling: true,
  clientAccountType: 'Individual',
};

var validAccountsResponse = {
  accounts: [validAccount],
  userId: 12345,
};

var validBalance = {
  currency: 'CAD',
  cash: 243971.7,
  marketValue: 6017,
  totalEquity: 249988.7,
  buyingPower: 496367.2,
  maintenanceExcess: 248183.6,
  isRealTime: false,
};

var validBalancesResponse = {
  perCurrencyBalances: [validBalance],
  combinedBalances: [validBalance],
  sodPerCurrencyBalances: [validBalance],
  sodCombinedBalances: [validBalance],
};

var validPosition = {
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

var validPositionsResponse = {
  positions: [validPosition],
};

describe('ZAccount Schema', function () {
  test('should validate correct account data', () => {
    var result = ZAccount.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  test('should reject invalid account data', () => {
    var result = ZAccount.safeParse(invalidAccount);
    expect(result.success).toBe(false);

    if (!result.success) {
      // Optional: Verify specific error messages
      var formattedError = result.error.format();
      expect(formattedError.status?._errors).toBeDefined();
      expect(formattedError.isPrimary?._errors).toBeDefined();
    }
  });
});

describe('ZGetAccountsResponse Schema', function () {
  test('should validate correct accounts response data', () => {
    var result = ZGetAccountsResponse.safeParse(validAccountsResponse);
    expect(result.success).toBe(true);
  });

  test('should reject response with invalid account data', () => {
    var result = ZGetAccountsResponse.safeParse({
      accounts: [invalidAccount],
      userId: 12345,
    });
    expect(result.success).toBe(false);
  });
});

describe('ZBalance Schema', function () {
  test('should validate correct balance data', () => {
    var result = ZBalance.safeParse(validBalance);
    expect(result.success).toBe(true);
  });

  test('should reject invalid balance data', () => {
    var invalidBalance = { ...validBalance, isRealTime: 'not-a-boolean' };
    var result = ZBalance.safeParse(invalidBalance);
    expect(result.success).toBe(false);
  });
});

describe('ZGetAccountBalancesResponse Schema', function () {
  test('should validate correct balances response data', () => {
    var result = ZGetAccountBalancesResponse.safeParse(validBalancesResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZPosition Schema', function () {
  test('should validate correct position data', () => {
    var result = ZPosition.safeParse(validPosition);
    expect(result.success).toBe(true);
  });

  test('should validate position data with optional closedQuantity', () => {
    var positionWithClosed = { ...validPosition, closedQuantity: 50 };
    var result = ZPosition.safeParse(positionWithClosed);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountPositionsResponse Schema', function () {
  test('should validate correct positions response data', () => {
    var result = ZGetAccountPositionsResponse.safeParse(validPositionsResponse);
    expect(result.success).toBe(true);
  });
});
