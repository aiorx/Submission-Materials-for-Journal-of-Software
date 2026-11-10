// Aided with basic GitHub coding tools
import {
  ZAccountActivity,
  ZGetAccountActivitiesRequest,
  ZGetAccountActivitiesResponse,
  ZOrder,
  ZGetAccountOrdersRequest,
  ZGetAccountOrdersResponse,
  ZExecution,
  ZGetAccountExecutionsRequest,
  ZGetAccountExecutionsResponse
} from '../../zod/accounts.extra';

// Mock data for testing
var validAccountActivitiesRequest = {
  accountId: '26598145',
  startTime: '2023-01-01T00:00:00.000000-05:00',
  endTime: '2023-01-31T23:59:59.000000-05:00'
};

var validAccountActivity = {
  tradeDate: '2023-01-15T00:00:00.000000-05:00',
  transactionDate: '2023-01-15T00:00:00.000000-05:00',
  settlementDate: '2023-01-17T00:00:00.000000-05:00',
  action: 'Buy',
  symbol: 'AAPL',
  symbolId: 8049,
  description: 'Apple Inc.',
  currency: 'USD',
  quantity: 10,
  price: 150.5,
  grossAmount: 1505.0,
  commission: 4.95,
  netAmount: 1509.95,
  type: 'Trade'
};

var validAccountActivitiesResponse = {
  activities: [validAccountActivity]
};

var validOrdersRequest = {
  accountId: '26598145',
  startTime: '2023-01-01T00:00:00.000000-05:00',
  endTime: '2023-01-31T23:59:59.000000-05:00',
  stateFilter: 'All'
};

var validOrder = {
  id: 177106005,
  symbol: 'AAPL',
  symbolId: 8049,
  totalQuantity: 10,
  openQuantity: 0,
  filledQuantity: 10,
  canceledQuantity: 0,
  side: 'Buy',
  orderType: 'Limit',
  limitPrice: 150.5,
  isAllOrNone: false,
  isAnonymous: false,
  source: 'TradingAPI',
  timeInForce: 'Day',
  state: 'Executed',
  chainId: 17710600,
  creationTime: '2023-01-15T09:30:00.000000-05:00',
  updateTime: '2023-01-15T09:35:00.000000-05:00',
  primaryRoute: 'AUTO',
  orderRoute: 'LAMP',
  commissionCharged: 4.95,
  exchangeOrderId: 'XS1771060050147',
  isSignificantShareholder: false,
  isInsider: false,
  isLimitOffsetInDollar: true,
  userId: 42,
  strategyType: 'Regular',
  legs: []
};

var validOrdersResponse = {
  orders: [validOrder]
};

var validExecutionsRequest = {
  accountId: '26598145',
  startTime: '2023-01-01T00:00:00.000000-05:00',
  endTime: '2023-01-31T23:59:59.000000-05:00'
};

var validExecution = {
  symbol: 'AAPL',
  symbolId: 8049,
  quantity: 10,
  side: 'Buy',
  price: 150.5,
  id: 53817310,
  orderId: 177106005,
  orderChainId: 17710600,
  exchangeExecId: 'XS1771060050147',
  timestamp: '2023-01-15T09:35:00.000000-05:00',
  venue: 'LAMP',
  totalCost: 1505.0,
  orderPlacementCommission: 0,
  commission: 4.95,
  executionFee: 0,
  secFee: 0,
  canadianExecutionFee: 0,
  parentId: 0
};

var validExecutionsResponse = {
  executions: [validExecution]
};

describe('ZGetAccountActivitiesRequest Schema', function () {
  test('should validate correct activities request', () => {
    var result = ZGetAccountActivitiesRequest.safeParse(validAccountActivitiesRequest);
    expect(result.success).toBe(true);
  });

  test('should validate request with only required fields', () => {
    var result = ZGetAccountActivitiesRequest.safeParse({ accountId: '26598145' });
    expect(result.success).toBe(true);
  });
});

describe('ZAccountActivity Schema', function () {
  test('should validate correct activity data', () => {
    var result = ZAccountActivity.safeParse(validAccountActivity);
    expect(result.success).toBe(true);
  });

  test('should reject invalid activity data', () => {
    var invalidActivity = { ...validAccountActivity, quantity: 'not-a-number' };
    var result = ZAccountActivity.safeParse(invalidActivity);
    expect(result.success).toBe(false);
  });
});

describe('ZGetAccountActivitiesResponse Schema', function () {
  test('should validate correct activities response', () => {
    var result = ZGetAccountActivitiesResponse.safeParse(validAccountActivitiesResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountOrdersRequest Schema', function () {
  test('should validate correct orders request', () => {
    var result = ZGetAccountOrdersRequest.safeParse(validOrdersRequest);
    expect(result.success).toBe(true);
  });

  test('should validate request with optional fields', () => {
    var result = ZGetAccountOrdersRequest.safeParse({
      accountId: '26598145',
      orderId: 177106005
    });
    expect(result.success).toBe(true);
  });

  test('should reject invalid stateFilter value', () => {
    var invalidRequest = { ...validOrdersRequest, stateFilter: 'Invalid' };
    var result = ZGetAccountOrdersRequest.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});

describe('ZOrder Schema', function () {
  test('should validate correct order data', () => {
    var result = ZOrder.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  test('should validate with optional fields', () => {
    var orderWithOptionals = {
      ...validOrder,
      stopPrice: 145.0,
      icebergQuantity: 2,
      minQuantity: 1,
      avgExecPrice: 150.5,
      lastExecPrice: 150.5,
      gtdDate: '2023-01-16T00:00:00.000000-05:00',
      clientReasonStr: 'Testing',
      notes: 'Test order',
      secondaryRoute: 'NYSE',
      venueHoldingOrder: 'NYSE',
      placementCommission: 0,
      mainChainId: 17710600
    };
    var result = ZOrder.safeParse(orderWithOptionals);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountOrdersResponse Schema', function () {
  test('should validate correct orders response', () => {
    var result = ZGetAccountOrdersResponse.safeParse(validOrdersResponse);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountExecutionsRequest Schema', function () {
  test('should validate correct executions request', () => {
    var result = ZGetAccountExecutionsRequest.safeParse(validExecutionsRequest);
    expect(result.success).toBe(true);
  });

  test('should validate request with only required fields', () => {
    var result = ZGetAccountExecutionsRequest.safeParse({ accountId: '26598145' });
    expect(result.success).toBe(true);
  });
});

describe('ZExecution Schema', function () {
  test('should validate correct execution data', () => {
    var result = ZExecution.safeParse(validExecution);
    expect(result.success).toBe(true);
  });

  test('should validate with optional notes field', () => {
    var executionWithNotes = {
      ...validExecution,
      notes: 'Test execution'
    };
    var result = ZExecution.safeParse(executionWithNotes);
    expect(result.success).toBe(true);
  });
});

describe('ZGetAccountExecutionsResponse Schema', function () {
  test('should validate correct executions response', () => {
    var result = ZGetAccountExecutionsResponse.safeParse(validExecutionsResponse);
    expect(result.success).toBe(true);
  });
});
