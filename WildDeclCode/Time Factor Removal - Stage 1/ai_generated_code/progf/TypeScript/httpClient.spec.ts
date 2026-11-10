// Assisted using common GitHub development utilities
/**
 * @fileoverview Tests for httpClient using undici MockAgent and jest.
 */
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var beforeEach = require('vitest').beforeEach;
var afterEach = require('vitest').afterEach;
var vi = require('vitest').vi;
var MockAgent = require('undici').MockAgent;
var MockPool = require('undici').MockPool;
var createRetryAgent = require('../src/network/httpClient').createRetryAgent;

/* eslint-disable */
// Add type declaration for global mockAgent
declare global {
  var mockAgentForTest: MockAgent;
}

// Mock the Agent constructor from undici to use our MockAgent instance
vi.mock('undici', async function () {
  // Store the actual implementation
  var originalModule = await vi.importActual('undici');

  return {
    ...originalModule,
    // Mock agent constructor to return our mockAgent
    Agent: vi.fn().mockImplementation(() => {
      // We'll set this in the test
      return global.mockAgentForTest;
    }),
  };
});
/* eslint-enable */

describe('createRetryAgent', function () {
  var mockAgent: MockAgent;
  var mockPool: MockPool;

  beforeEach(() => {
    mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    // Store the mockAgent in a global variable so our mocked Agent constructor can access it
    global.mockAgentForTest = mockAgent;
    mockPool = mockAgent.get('http://localhost:8080');
  });

  afterEach(async () => {
    await mockAgent.close();
    // Optional property can be deleted
    // @ts-expect-error its a global variable
    delete global.mockAgentForTest;
  });

  it('should retry on failure and succeed on retry', async () => {
    expect.assertions(2);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(500, 'fail').times(1);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(200, 'ok').times(1);

    var agent = createRetryAgent({
      retry: { maxRetries: 1, statusCodes: [500] },
      agentOptions: { keepAliveTimeout: 1 },
    });
    var req = agent.request({ origin: 'http://localhost:8080', path: '/test', method: 'GET' });
    var res = await req;

    expect(res.statusCode).toBe(200);
    var data = await res.body.text();
    expect(data).toBe('ok');
  });

  it('should not retry if status code is not in statusCodes', async () => {
    expect.assertions(1);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(404, 'not found').times(1);
    var agent = createRetryAgent({
      retry: { maxRetries: 2, statusCodes: [500] },
      agentOptions: { keepAliveTimeout: 1 },
    });
    var req = agent.request({ origin: 'http://localhost:8080', path: '/test', method: 'GET' });
    var res = await req;
    expect(res.statusCode).toBe(404);
  });

  it('should respect initialBaseRetryDelayMs and maxJitterFactor', async () => {
    expect.assertions(1);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(500, 'fail').times(2);
    var start = Date.now();
    var agent = createRetryAgent({
      retry: { maxRetries: 1, statusCodes: [500], initialBaseRetryDelayMs: 200, maxJitterFactor: 0 },
      agentOptions: { keepAliveTimeout: 1 },
    });
    var req = agent.request({ origin: 'http://localhost:8080', path: '/test', method: 'GET' });
    await req.catch(() => {});
    var elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(200);
  });

  it('should disable jitter if disableJitter is true', async () => {
    expect.assertions(1);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(500, 'fail').times(2);
    var start = Date.now();
    var agent = createRetryAgent({
      retry: { maxRetries: 1, statusCodes: [500], initialBaseRetryDelayMs: 100, disableJitter: true },
      agentOptions: { keepAliveTimeout: 1 },
    });
    var req = agent.request({ origin: 'http://localhost:8080', path: '/test', method: 'GET' });
    await req.catch(() => {});
    var elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('should abort after maxRetries', async () => {
    expect.assertions(1);
    mockPool.intercept({ path: '/test', method: 'GET' }).reply(500, 'fail').times(3);
    var agent = createRetryAgent({
      retry: { maxRetries: 2, statusCodes: [500] },
      agentOptions: { keepAliveTimeout: 1 },
    });
    await expect(agent.request({ origin: 'http://localhost:8080', path: '/test', method: 'GET' })).rejects.toThrow();
  });
});
