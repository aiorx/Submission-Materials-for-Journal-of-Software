// Aided with basic GitHub coding tools
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var vi = require('vitest').vi;
var beforeEach = require('vitest').beforeEach;
var afterEach = require('vitest').afterEach;
var type = require('vitest').type;
var MockedFunction = require('vitest').MockedFunction;
var core = require('@actions/core');
var github = require('@actions/github');
var run = require('../main.js').run;

// Mock the action modules
vi.mock('@actions/core');
vi.mock('@actions/github');

var FORBIDDEN_GREETING = 'avi';
var DEFAULT_GREETING = 'Hello';
var TEST_TOKEN = 'test-token';
var TEST_PR_NUMBER = 123;

/**
 * Test suite for the {{ACTION_NAME}} GitHub action
 */
describe('{{ACTION_NAME}} Action', function () {
  var mockGetInput: MockedFunction<typeof core.getInput>;
  var mockSetFailed: MockedFunction<typeof core.setFailed>;
  var mockWarning: MockedFunction<typeof core.warning>;
  var mockInfo: MockedFunction<typeof core.info>;
  var mockGetOctokit: MockedFunction<typeof github.getOctokit>;
  var mockCreateComment: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock functions
    mockGetInput = vi.mocked(core.getInput);
    mockSetFailed = vi.mocked(core.setFailed);
    mockWarning = vi.mocked(core.warning);
    mockInfo = vi.mocked(core.info);
    mockGetOctokit = vi.mocked(github.getOctokit);
    mockCreateComment = vi.fn().mockResolvedValue({});

    // Set up default github context
    Object.defineProperty(github, 'context', {
      value: {
        eventName: 'pull_request',
        repo: {
          owner: 'test-owner',
          repo: 'test-repo',
        },
        issue: {
          number: TEST_PR_NUMBER,
        },
      },
      writable: true,
    });

    // Mock octokit
    mockGetOctokit.mockReturnValue({
      rest: {
        issues: {
          createComment: mockCreateComment,
        },
      },
    } as unknown as ReturnType<typeof github.getOctokit>);

    // Set up environment
    process.env.GITHUB_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
  });

  /**
   * Test successful greeting comment on PR
   */
  it('should comment on PR with custom greeting', async () => {
    var customGreeting = 'Hello from tests!';
    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return customGreeting;
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    mockCreateComment.mockResolvedValue({});

    // Call the run function
    await run();

    expect(mockCreateComment).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      issue_number: TEST_PR_NUMBER,
      body: customGreeting,
    });

    expect(mockInfo).toHaveBeenCalledWith(`Successfully commented on PR #${TEST_PR_NUMBER} with greeting: "${customGreeting}"`);
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  /**
   * Test default greeting when no input provided
   */
  it('should use default greeting when input is empty', async () => {
    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return '';
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    mockCreateComment.mockResolvedValue({});

    await run();

    expect(mockCreateComment).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      issue_number: TEST_PR_NUMBER,
      body: DEFAULT_GREETING,
    });
  });

  /**
   * Test action fails when greeting is forbidden value
   */
  it('should fail when greeting is "avi"', async () => {
    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return FORBIDDEN_GREETING;
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith('Action failed: greeting cannot be "avi"');
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  /**
   * Test action fails when GitHub token is missing
   */
  it('should fail when GitHub token is missing', async () => {
    delete process.env.GITHUB_TOKEN;

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return DEFAULT_GREETING;
      if (name === 'github-token') return '';
      return '';
    });

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith('GitHub token is required');
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  /**
   * Test warning when not running on pull request event
   */
  it('should warn when not running on pull request event', async () => {
    Object.defineProperty(github, 'context', {
      value: {
        eventName: 'push',
        repo: {
          owner: 'test-owner',
          repo: 'test-repo',
        },
      },
      writable: true,
    });

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return DEFAULT_GREETING;
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    await run();

    expect(mockWarning).toHaveBeenCalledWith('This action is designed to work with pull request events');
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  /**
   * Test error handling when comment creation fails
   */
  it('should handle API errors gracefully', async () => {
    var apiError = new Error('API request failed');

    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return DEFAULT_GREETING;
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    mockCreateComment.mockRejectedValue(apiError);

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith('Action failed with error: API request failed');
  });

  /**
   * Test handling of unknown errors
   */
  it('should handle unknown errors', async () => {
    mockGetInput.mockImplementation((name: string) => {
      if (name === 'greeting') return DEFAULT_GREETING;
      if (name === 'github-token') return TEST_TOKEN;
      return '';
    });

    mockCreateComment.mockRejectedValue('Unknown error');

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith('Action failed with error: Unknown error occurred');
  });
});
